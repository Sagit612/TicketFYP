import express, { Request, Response } from 'express';
import { NotFoundError } from '@sagittickets/common';
import { Ticket } from '../models/ticket.model';
import { show } from '../controllers/show/show.controller';

const router = express.Router();

router.get('/api/tickets/:id', show);

export { router as showTicketRouter };