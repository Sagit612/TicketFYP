import { TicketModel } from '../../models/ticket.model';
import express, {Request, Response} from 'express';

export const index = async (req: Request, res: Response) => {
    const tickets = await TicketModel.find({
        orderId: undefined
    });
    res.send(tickets);
}