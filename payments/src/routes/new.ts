import express from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@sagittickets/common';
import { newPayment } from '../controllers/new/new.controller';


const createTokenChain = () => body('token').not().isEmpty();
const createOrderIdChain = () => body('orderId').not().isEmpty();

const router = express.Router();

router.post('/api/payments', requireAuth,[
createTokenChain(),
createOrderIdChain()
], validateRequest, newPayment) 

export {router as createChargeRouter};