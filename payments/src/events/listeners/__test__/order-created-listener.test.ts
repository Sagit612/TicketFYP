import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@sagittickets/common";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Order } from "../../../models/order";


const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'anything',
        expiresAt: 'anything',
        ticket: {
            id: 'anything',
            price: 20
        }
    }
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, data, message};
}

it('acks the message from Order service', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);
    expect(message.ack).toHaveBeenCalled();
});

it('replicate the order information', async() => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);
    const order = await Order.findById(data.id);
    expect(order!.price).toEqual(data.ticket.price);
})