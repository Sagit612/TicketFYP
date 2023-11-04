import { Publisher, Subjects, TicketUpdatedEvent } from "@sagittickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated; // to never change the value of subject
    
}

