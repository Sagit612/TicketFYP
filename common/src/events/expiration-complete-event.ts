import { Subjects } from "./subjects";
interface ExpirationCompletedEvent {
    subject: Subjects.ExpirationCompleted;
    data: {
        orderId: string;
    };
}
export { ExpirationCompletedEvent };