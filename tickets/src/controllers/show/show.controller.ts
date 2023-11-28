import express, { Request, Response } from 'express';
import { NotFoundError } from '@sagittickets/common';
import { TicketModel } from '../../models/ticket.model';

export const show = async (req: Request, res: Response) => {
    const ticket = await TicketModel.findOne({_id: req.params.id});
    if (!ticket) {
        throw new NotFoundError();
    }
    res.status(200).send(ticket);
}