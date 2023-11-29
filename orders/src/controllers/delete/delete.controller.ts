import express, { Request, Response } from 'express';
import { OrderStatus } from '../../models/order.model';
import { NotAuthorizedError, NotFoundError} from '@sagittickets/common';
import { OrderCancelledPublisher } from '../../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { OrderModel } from '../../models/central';

export const deleteTicket = async (req: Request, res: Response) => {
    const existingOrder = await OrderModel.findById(req.params.orderId).populate('ticket');
    if (!existingOrder) {
        throw new NotFoundError();
    }
    if (existingOrder.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    existingOrder.status = OrderStatus.Cancelled;
    await existingOrder.save();
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: existingOrder.id,
        version: existingOrder.version,
        ticket: {
            id: existingOrder.ticket.id
        }
    })
    res.status(204).send(existingOrder);
}