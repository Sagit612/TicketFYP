import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@sagittickets/common";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { TicketModel } from "../../../models/ticket.model";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const ticket  = TicketModel.createTicket({
        title: 'newTicket',
        price: 99,
        photo_id: "655263447ee155a01028104d",
        photo_url: "https://res.cloudinary.com/dvxfixf5q/image/upload/v1699898180/o5ekhzshydxvxixqlb3z.jpg",
        userId: 'asdf'
    });
    await ticket.save();
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'anything',
        expiresAt: 'anything',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, data, ticket, message};
}

it('sets orderId for the ticket', async () => {
    const { listener, data, ticket, message } = await setup();
    await listener.onMessage(data, message);
    const updatedTicket = await TicketModel.findById(ticket.id);
    expect(updatedTicket!.orderId).toEqual(data.id);
})

it('acks the message', async () => {
    const { listener, data, ticket, message } = await setup();
    await listener.onMessage(data, message);
    expect(message.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const { listener, data, ticket, message } = await setup();
    await listener.onMessage(data, message);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    // @ts-ignore
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(data.id).toEqual(ticketUpdatedData.orderId);
})