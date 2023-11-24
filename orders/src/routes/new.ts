import mongoose from 'mongoose';
import express from 'express';
import {requireAuth, validateRequest } from '@sagittickets/common';
import { body } from 'express-validator';
import { newOrder } from '../controllers/new/new.controller';

const router = express.Router();
const createTicketIdChain = () => body('ticketId').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('TicketId must be provided')

router.post('/api/orders', requireAuth, [
    createTicketIdChain()
], validateRequest, newOrder);

export {router as newOrderRouter};