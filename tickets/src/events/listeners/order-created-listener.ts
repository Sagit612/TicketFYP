import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@sagittickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const { id, ticket } = data;
        const existingTicket = await Ticket.findById(ticket.id);
        if (!existingTicket) {
            throw new Error('Not found Ticket');
        }
        existingTicket.set({ orderId: id});
        await existingTicket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: existingTicket.id,
            price: existingTicket.price,
            title: existingTicket.title,
            userId: existingTicket.userId,
            orderId: existingTicket.orderId,
            version: existingTicket.version
        })
        msg.ack();
    }
}

export { OrderCreatedListener }