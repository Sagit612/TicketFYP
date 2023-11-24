import { requireAuth } from '@sagittickets/common';
import express from 'express';
import { index } from '../controllers/index/index.controller';

const router = express.Router();

router.get('/api/orders', requireAuth, index);

export {router as indexOrderRouter};