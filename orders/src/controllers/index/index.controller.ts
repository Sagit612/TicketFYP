import express, { Request, Response } from 'express';
import { Order } from '../../models/order.model';

export const index = async (req: Request, res: Response) => {
    const availableOrders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');
    res.send(availableOrders);
}