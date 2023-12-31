import { OrderCancelledEvent } from '@sagittickets/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketModel } from '../../../models/ticket.model';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = TicketModel.createTicket({
        title: 'concert',
        price: 20,
        photo_id: "655263447ee155a01028104d",
        photo_url: "https://res.cloudinary.com/dvxfixf5q/image/upload/v1699898180/o5ekhzshydxvxixqlb3z.jpg",
        userId: 'asdf',
    });
    ticket.set({ orderId });
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
        id: ticket.id,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { msg, data, ticket, orderId, listener };
};

it('updates the ticket, publishes an event, and acks the message', async () => {
    const { msg, data, ticket, orderId, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await TicketModel.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
