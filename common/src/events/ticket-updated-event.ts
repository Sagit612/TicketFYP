import { Subjects } from "./subjects";
interface TicketUpdatedEvent {
    subject: Subjects.TicketUpdated;
    data: {
        id: string;
        version: number;
        title: string;
        price: number;
        photo_id: string;
        photo_url: string;
        userId: string;
        orderId?: string;
    };
}

export {TicketUpdatedEvent}