import express, { Request, Response } from 'express';
import { OrderModel } from '../../models/central';

export const index = async (req: Request, res: Response) => {
    const availableOrders = await OrderModel.find({
        userId: req.currentUser!.id
    }).populate('ticket');
    res.send(availableOrders);
}