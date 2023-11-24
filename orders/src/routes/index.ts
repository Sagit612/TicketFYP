import { requireAuth } from '@sagittickets/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth,  async (req: Request, res: Response) => {
    const availableOrder = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');
    res.send(availableOrder);
});

export {router as indexOrderRouter};