import mongoose from "mongoose";
import { app } from "../../app";
import request from 'supertest';
import { OrderStatus } from "@sagittickets/common";
import { stripe } from "../../stripe";
import { PaymentModel } from "../../models/payment.model";
import { OrderModel } from "../../models/order.model";

it('return 404 error when order does not exist to pay', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'anything',
            orderId: new mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
})

it('return 401 error when order does not belong to the current user', async () => {
    const newOrder = OrderModel.createOrder({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'anything',
        price: 20
    })
    await newOrder.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
        token: 'anything',
        orderId: newOrder.id,
    })
    .expect(401);
})
it('return 400 error when order status is cancelled', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const newOrder = OrderModel.createOrder({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Cancelled,
        userId: userId,
        price: 20
    })
    await newOrder.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
        token: 'anything',
        orderId: newOrder.id,
    })
    .expect(400);
});

it('return 204 with valid data inputs', async() => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 10000);
    const newOrder = OrderModel.createOrder({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: userId,
        price
    })
    await newOrder.save();
    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
        token: 'tok_visa',
        orderId: newOrder.id,
    })
    .expect(201);
    const stripeCharges = await stripe.charges.list({limit: 50});
    const stripeCharge = stripeCharges.data.find(charge => {
        return charge.amount === price * 100;
    })
    expect(stripeCharge).toBeDefined();
    expect(stripeCharge?.currency).toEqual('usd');

    const payment = await PaymentModel.findOne({
        orderId: newOrder.id,
        stripeId: stripeCharge?.id
    })
    expect(payment).not.toBeNull();
})