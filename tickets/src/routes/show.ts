import express from 'express';
import { show } from '../controllers/show/show.controller';

const router = express.Router();

router.get('/api/tickets/:id', show);

export { router as showTicketRouter };