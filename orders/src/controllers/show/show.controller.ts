import { NotAuthorizedError, NotFoundError} from '@sagittickets/common';
import express, { Request, Response } from 'express';
import { TicketModel, OrderModel } from '../../models/central';

export const show = async (req: Request, res: Response) => {
    const existingOrder = await OrderModel.findById(req.params.orderId).populate('ticket');

    if(!existingOrder) {
        throw new NotFoundError();
    }
    if (existingOrder.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    res.send(existingOrder);
}