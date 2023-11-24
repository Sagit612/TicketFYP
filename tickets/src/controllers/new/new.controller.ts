import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@sagittickets/common';
import { Ticket } from '../../models/ticket';
import { TicketCreatedPublisher } from '../../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { uploadToCloudinary } from '../../services/cloudinary.service';


export const newTicket = async (req: Request, res: Response) => {
    const { title, price, photo } = req.body;
    const { public_id, secure_url} = await uploadToCloudinary(photo);
    const ticket = Ticket.createTicket({
        title,
        price,
        photo_id: public_id,
        photo_url: secure_url,
        userId: req.currentUser!.id
    });
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        version: ticket.version,
        title: ticket.title,
        price: ticket.price,
        photo_id: ticket.photo_id,
        photo_url: ticket.photo_url,
        userId: ticket.userId
    })
    res.status(201).send(ticket);
}