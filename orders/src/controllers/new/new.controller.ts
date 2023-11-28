import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus} from '@sagittickets/common';
import { OrderCreatedPublisher } from '../../events/publishers/order-created-publisher';
import { TicketModel, OrderModel } from '../../models/central';
import { natsWrapper } from '../../nats-wrapper';

const WINDOW_SECONDS_FOR_EXPIRATION = 60;

export const newOrder = async (req: Request, res: Response) => {
    const { ticketId } = req.body 
    const availableTicket = await TicketModel.findById(ticketId);
    if (!availableTicket) {
        throw new NotFoundError();
    }
    const isReserved = await availableTicket.isReserved();
    if (isReserved) {
        throw new BadRequestError("You have to wait or buy another ticket because the ticket is already reserved");
    }
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + WINDOW_SECONDS_FOR_EXPIRATION)
    const newOrder = OrderModel.createOrder({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: availableTicket
    });
    await newOrder.save();
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: newOrder.id,
        version: newOrder.version,
        status: newOrder.status as OrderStatus,
        userId: newOrder.userId,
        expiresAt: newOrder.expiresAt.toISOString(),
        ticket: {
            id: availableTicket.id,
            price: availableTicket.price
        }
    })
    res.status(201).send(newOrder);
}