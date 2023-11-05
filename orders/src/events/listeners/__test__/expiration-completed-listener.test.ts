import { ExpirationCompletedListener } from "../expiration-completed-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ExpirationCompletedEvent, OrderStatus } from "@sagittickets/common";


const setup = async () => {
    // create an instance of the listener
    const listener = new ExpirationCompletedListener(natsWrapper.client);

    const newTicket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "new ticket",
        price: 20
    })
    await newTicket.save();

    const newOrder = Order.build({
        userId: 'anyid',
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket: newTicket,
    })
    await newOrder.save();
    // create a fake data object
    const data: ExpirationCompletedEvent['data'] = {
        orderId: newOrder.id
    }
    // create a face msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg, newOrder, newTicket};
};

it('updates the order status to cancelled', async () => {
    const {listener, data, msg, newOrder, newTicket} = await setup();
    await listener.onMessage(data, msg);
    const updatedOrder = await Order.findById(newOrder.id);
    expect(updatedOrder).toBeDefined();
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async() => {
    const {listener, data, msg, newOrder, newTicket} = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(newOrder.id);
});

it('ack the message', async() => {
    const {listener, data, msg, newOrder, newTicket} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})