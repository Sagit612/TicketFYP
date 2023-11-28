import express from 'express';
import { index } from '../controllers/index/index.controller';

const router = express.Router();

router.get('/api/tickets', index);

export { router as indexTicketRouter};