import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@sagittickets/common";
import { TicketModel} from '../../models/central';
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await TicketModel.findByEvent(data);
        
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        const {title, price, photo_id, photo_url} = data;
        ticket.set({title, price, photo_id, photo_url});
        await ticket.save();
        msg.ack();
    }
}