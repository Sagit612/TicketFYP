import express, { Request, Response } from 'express';
import { Order } from '../../models/order';

export const index = async (req: Request, res: Response) => {
    const availableOrder = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');
    res.send(availableOrder);
}