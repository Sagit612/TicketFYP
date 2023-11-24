import { Ticket } from '../../models/ticket';
import express, {Request, Response} from 'express';
export const index = async (req: Request, res: Response) => {
    const tickets = await Ticket.find({
        orderId: undefined
    });
    res.send(tickets);
}