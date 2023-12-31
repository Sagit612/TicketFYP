import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@sagittickets/common';
import { OrderModel } from '../../models/order.model';
import { stripe } from '../../stripe';
import { PaymentModel } from '../../models/payment.model';
import { PaymentCreatedPublisher } from '../../events/publishers/payment-created-publisher';
import { natsWrapper } from '../../nats-wrapper';


export const newPayment = async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const existingOrder = await OrderModel.findById(orderId);
    if(!existingOrder) {
        throw new NotFoundError();
    }
    if(existingOrder.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    if(existingOrder.status === OrderStatus.Cancelled){
        throw new BadRequestError("Order is expired, cannot pay for it");
    }

   const newCharge = await stripe.charges.create({
        currency: 'usd',
        amount: existingOrder.price * 100,
        source: token
    })
    const newPayment = PaymentModel.createPayment({
        orderId,
        stripeId: newCharge.id
    })
    await newPayment.save()
    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: newPayment.id,
        orderId: newPayment.orderId,
        stripeId: newPayment.stripeId
    })
    res.status(201).send({paymentId: newPayment.id});
}