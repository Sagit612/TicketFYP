import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@sagittickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket.model";

import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const { id, ticket } = data;
        const existingTicket = await Ticket.findById(ticket.id);
        if(!existingTicket) {
            throw new Error('Not found ticket');
        }

        existingTicket.set({ orderId: undefined});
        await existingTicket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: existingTicket.id,
            price: existingTicket.price,
            title: existingTicket.title,
            photo_id: existingTicket.photo_id,
            photo_url: existingTicket.photo_url,
            userId: existingTicket.userId,
            orderId: existingTicket.orderId,
            version: existingTicket.version
        })
        msg.ack();
    }
}

export {OrderCancelledListener};