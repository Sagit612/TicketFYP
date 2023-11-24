import {requireAuth } from '@sagittickets/common';
import express, { Request, Response } from 'express';
import { show } from '../controllers/show/show.controller';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, show);

export {router as showOrderRouter};