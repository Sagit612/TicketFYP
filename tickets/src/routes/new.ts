import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@sagittickets/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { uploadToCloudinary } from '../services/cloudinary.service';


const createTitleChain = () => body('title').not().isEmpty().withMessage('Title is required');
const createPriceChain = () => body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0');
const createPhotoBase64Chain = () => body('photo').not().isEmpty().withMessage('Photo must be provided');
const router = express.Router();

router.post('/api/tickets', requireAuth, [
createTitleChain(),
    createPriceChain(),
    createPhotoBase64Chain()
], validateRequest, async (req: Request, res: Response) => {
    const { title, price, photo } = req.body;
    const { public_id, secure_url} = await uploadToCloudinary(photo);
    const ticket = Ticket.build({
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

});

export { router as createTicketRouter };