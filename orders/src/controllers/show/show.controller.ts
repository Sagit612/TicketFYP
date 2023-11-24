import { NotAuthorizedError, NotFoundError, requireAuth } from '@sagittickets/common';
import express, { Request, Response } from 'express';
import { Order } from '../../models/order';

export const show = async (req: Request, res: Response) => {
    const existingOrder = await Order.findById(req.params.orderId).populate('ticket');

    if(!existingOrder) {
        throw new NotFoundError();
    }
    if (existingOrder.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    res.send(existingOrder);
}