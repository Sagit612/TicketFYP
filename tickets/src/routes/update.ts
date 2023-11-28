import express from 'express';
import { body } from 'express-validator';
import {
    validateRequest,
    requireAuth,
} from '@sagittickets/common';



import { update } from '../controllers/update/update.controller';

const router = express.Router();
const createTitleChain = () => body('title').not().isEmpty().withMessage('Title is required');
const createPriceChain = () => body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0');
router.put('/api/tickets/:id', requireAuth, 
[
    createTitleChain(),
    createPriceChain()
],
validateRequest, update);

export { router as updateTicketRouter};