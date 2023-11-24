import express from 'express';
import {requireAuth } from '@sagittickets/common';
import { deleteTicket } from '../controllers/delete/delete.controller';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, deleteTicket);

export {router as deleteOrderRouter};