import { Subjects } from "./subjects";
interface TicketCreatedEvent {
    subject: Subjects.TicketCreated;
    data: {
        id: string;
        version: number;
        title: string;
        price: number;
        photo_id: string;
        photo_url: string;
        userId: string;
    };
}

export { TicketCreatedEvent };