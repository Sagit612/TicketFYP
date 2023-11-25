import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@sagittickets/common';
import { body } from 'express-validator';
import { Ticket } from '../../models/ticket.model';
import { Order } from '../../models/order.model';
import { OrderCreatedPublisher } from '../../events/publishers/order-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

const WINDOW_SECONDS_FOR_EXPIRATION = 60;

export const newOrder = async (req: Request, res: Response) => {
    const { ticketId } = req.body 
    const availableTicket = await Ticket.findById(ticketId);
    if (!availableTicket) {
        throw new NotFoundError();
    }
    const isReserved = await availableTicket.isReserved();
    if (isReserved) {
        throw new BadRequestError("You have to wait or buy another ticket because the ticket is already reserved");
    }
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + WINDOW_SECONDS_FOR_EXPIRATION)
    const newOrder = Order.createOrder({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: availableTicket
    });
    await newOrder.save();
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: newOrder.id,
        version: newOrder.version,
        status: newOrder.status,
        userId: newOrder.userId,
        expiresAt: newOrder.expiresAt.toISOString(),
        ticket: {
            id: availableTicket.id,
            price: availableTicket.price
        }
    })
    res.status(201).send(newOrder);
}