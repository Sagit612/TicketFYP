import { Subjects, Listener, OrderCreatedEvent, } from "@sagittickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { OrderModel } from "../../models/order.model";

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const newOrder = OrderModel.createOrder(
            {
                id: data.id,
                status: data.status,
                userId: data.userId,
                price: data.ticket.price,
                version: data.version
            }
        )
        await newOrder.save();
        msg.ack();
    }
}

export { OrderCreatedListener }