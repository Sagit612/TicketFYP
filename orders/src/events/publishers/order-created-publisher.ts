import { Publisher, Subjects, OrderCreatedEvent } from "@sagittickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    
}