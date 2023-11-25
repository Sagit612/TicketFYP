import express, {Request, Response} from 'express';
import { Ticket } from '../models/ticket.model';
import { index } from '../controllers/index/index.controller';

const router = express.Router();

router.get('/api/tickets', index);

export { router as indexTicketRouter};