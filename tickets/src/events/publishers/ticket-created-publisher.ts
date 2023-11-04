import { Publisher, Subjects, TicketCreatedEvent } from "@sagittickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated; // to never change the value of subject

}

