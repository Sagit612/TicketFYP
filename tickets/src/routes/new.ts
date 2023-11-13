import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@sagittickets/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';


const createTitleChain = () => body('title').not().isEmpty().withMessage('Title is required');
const createPriceChain = () => body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0');
const router = express.Router();

router.post('/api/tickets', requireAuth, [
createTitleChain(),
    createPriceChain()
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        version: ticket.version,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    })
    res.status(201).send(ticket);

});

export { router as createTicketRouter };