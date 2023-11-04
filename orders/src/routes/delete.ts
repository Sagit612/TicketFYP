import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@sagittickets/common';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const existingOrder = await Order.findById(req.params.orderId).populate('ticket');
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
});

export {router as deleteOrderRouter};