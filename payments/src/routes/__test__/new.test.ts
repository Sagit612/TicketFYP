import mongoose from "mongoose";
import { app } from "../../app";
import request from 'supertest';
import { Order } from "../../models/order";
import { OrderStatus } from "@sagittickets/common";

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
    const newOrder = Order.build({
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
    const newOrder = Order.build({
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
})