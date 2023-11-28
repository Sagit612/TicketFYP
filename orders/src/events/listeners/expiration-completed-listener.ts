import { ExpirationCompletedEvent, Listener, Subjects, OrderStatus } from "@sagittickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import {OrderModel } from '../../models/central';
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
    queueGroupName: string = queueGroupName;
    async onMessage(data: ExpirationCompletedEvent['data'], msg: Message){
        const existingOrder = await OrderModel.findById(data.orderId).populate('ticket');
        if (!existingOrder) {
            throw new Error('Not found order');
        }
        if (existingOrder.status === OrderStatus.Complete) {
            return msg.ack();
        }
        existingOrder.set({
            status: OrderStatus.Cancelled
        });
        await existingOrder.save();
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: existingOrder.id,
            version: existingOrder.version,
            ticket: {
                id: existingOrder.ticket.id
            }
        })
        msg.ack();
    }
}

export {ExpirationCompletedListener}
