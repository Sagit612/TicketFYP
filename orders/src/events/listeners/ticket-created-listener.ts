import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@sagittickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket.model";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price, photo_id, photo_url } = data;
        const ticket = Ticket.createTicket({
            id,
            title,
            price,
            photo_id,
            photo_url
        });
        await ticket.save();
        msg.ack();
    }
}