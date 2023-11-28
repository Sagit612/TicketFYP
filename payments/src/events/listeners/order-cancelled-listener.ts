import { Subjects, Listener, OrderCancelledEvent, OrderStatus } from "@sagittickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { OrderModel } from "../../models/order.model";

class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const existingOrder = await OrderModel.findOne({
            _id: data.id,
            version: data.version - 1
        });
        if (!existingOrder) {
            throw new Error('Not found Order');
        }
        existingOrder.set({ status: OrderStatus.Cancelled});
        await existingOrder.save();
        msg.ack();
    }
}

export { OrderCancelledListener }