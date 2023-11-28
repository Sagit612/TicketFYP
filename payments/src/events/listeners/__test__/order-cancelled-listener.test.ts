import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@sagittickets/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { OrderModel } from "../../../models/order.model";

const setup = async() => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const newOrder = OrderModel.createOrder({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'anything',
        price: 20
    })
    await newOrder.save();

    const data: OrderCancelledEvent['data'] = {
        id: newOrder.id,  
        ticket: {
            id: 'anything'
        },        
        version: 1,
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listener, msg, data, newOrder};
}

it('updates the status of the order', async () => {
    const { listener, msg, data, newOrder} = await setup();
    await listener.onMessage(data, msg); // create new order in payment service
    const updatedOrder = await OrderModel.findById(newOrder.id); // find the order in payment service
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled); // compare data
});

it('acks the message from order service', async () => {
    const { listener, msg, data, newOrder} = await setup();
    await listener.onMessage(data, msg); // create new order in payment service
    expect(msg.ack).toHaveBeenCalled();
})