import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@sagittickets/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { newPayment } from '../controllers/new/new.controller';


const createTokenChain = () => body('token').not().isEmpty();
const createOrderIdChain = () => body('orderId').not().isEmpty();

const router = express.Router();

router.post('/api/payments', requireAuth,[
createTokenChain(),
createOrderIdChain()
], validateRequest, newPayment) 

export {router as createChargeRouter};