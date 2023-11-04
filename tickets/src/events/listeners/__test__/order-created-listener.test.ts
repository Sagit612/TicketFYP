import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@sagittickets/common";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const ticket  = Ticket.build({
        title: 'newTicket',
        price: 99,
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

it('sets userId for the ticket', async () => {
    const { listener, data, ticket, message } = await setup();
    await listener.onMessage(data, message);
    const updatedTicket = await Ticket.findById(ticket.id);
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