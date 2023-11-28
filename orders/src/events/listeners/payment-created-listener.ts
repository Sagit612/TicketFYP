import { Listener, Subjects,OrderStatus, PaymentCreatedEvent } from "@sagittickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { OrderModel } from '../../models/central';

class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const existingOrder = await OrderModel.findById(data.orderId);
        if(!existingOrder) {
            throw new Error("Not found Order")
        }
        existingOrder.set({
            status: OrderStatus.Complete
        })
        await existingOrder.save();
        msg.ack()
    }   
}

export { PaymentCreatedListener }