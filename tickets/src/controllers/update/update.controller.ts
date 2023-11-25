import express, { Request, Response } from 'express';
import {
    NotFoundError,
    NotAuthorizedError,
    BadRequestError
} from '@sagittickets/common';
import { TicketUpdatedPublisher } from '../../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket.model';

import { uploadToCloudinary } from '../../services/cloudinary.service';

export const update = async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket){
        throw new NotFoundError();
    };

    if(ticket.orderId) {
         throw new BadRequestError('Ticket is reserving, cannot edit')
    }

    if(ticket.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    if(req.body.photo) {
        const {public_id, secure_url} = await uploadToCloudinary(req.body.photo);
        ticket.set({
            title: req.body.title,
            price: req.body.price,
            photo_id: public_id,
            photo_url: secure_url
        })
        await ticket.save();
        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            photo_id: ticket.photo_id,
            photo_url: ticket.photo_url,
            userId: ticket.userId
        })
        res.send(ticket);
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    })

    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        version: ticket.version,
        title: ticket.title,
        price: ticket.price,
        photo_id: ticket.photo_id,
        photo_url: ticket.photo_url,
        userId: ticket.userId
    })
    res.send(ticket);
}