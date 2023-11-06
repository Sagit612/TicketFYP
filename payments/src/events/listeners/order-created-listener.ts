import { Subjects, Listener, OrderCreatedEvent, } from "@sagittickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const order = Order.build(
            {
                id: data.id,
                status: data.status,
                userId: data.userId,
                price: data.ticket.price,
                version: data.version
            }
        )
        await order.save();
        msg.ack();
    }
}

export { OrderCreatedListener }