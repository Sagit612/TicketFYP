import { Subjects, Publisher, PaymentCreatedEvent,  } from "@sagittickets/common";

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

export { PaymentCreatedPublisher }