import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@sagittickets/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';

const router = express.Router();

router.post('/api/payments', requireAuth,[
    body('token')
        .not()
        .isEmpty(),
    body('orderId')
        .not()
        .isEmpty()
], validateRequest, async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const existingOrder = await Order.findById(orderId);
    if(!existingOrder) {
        throw new NotFoundError();
    }
    if(existingOrder.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    if(existingOrder.status === OrderStatus.Cancelled){
        throw new BadRequestError("Order is expired, cannot pay for it");
    }

   const charge = await stripe.charges.create({
        currency: 'usd',
        amount: existingOrder.price * 100,
        source: token
    })
    const payment = Payment.build({
        orderId,
        stripeId: charge.id
    })
    await payment.save()
    res.status(201).send({success: true});
}) 

export {router as createChargeRouter};