import express from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@sagittickets/common';

import { newTicket } from '../controllers/new/new.controller';


const createTitleChain = () => body('title').not().isEmpty().withMessage('Title is required');
const createPriceChain = () => body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0');
// const createPhotoBase64Chain = () => body('photo').not().isEmpty().withMessage('Photo must be provided');
const router = express.Router();

router.post('/api/tickets', requireAuth, [
createTitleChain(),
    createPriceChain(),
    // createPhotoBase64Chain()
], validateRequest, newTicket);

export { router as createTicketRouter };