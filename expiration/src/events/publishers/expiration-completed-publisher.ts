import { Publisher, Subjects, ExpirationCompletedEvent } from "@sagittickets/common";

class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent>{
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted; 
}

export { ExpirationCompletedPublisher}