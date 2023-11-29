import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { OrderStatus } from '../../models/order.model';
import { TicketModel, OrderModel } from '../../models/central';
import { natsWrapper } from '../../nats-wrapper';

it('returns 404 an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId
        })
        .expect(404)
});

it('returns an error if the ticket is already reserved', async () => {
    const ticket = TicketModel.createTicket({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
        photo_id:  "o5ekhzshydxvxixqlb3z",
        photo_url: "https://res.cloudinary.com/dvxfixf5q/image/upload/v1699898180/o5ekhzshydxvxixqlb3z.jpg",
    });
    await ticket.save();
    const order = OrderModel.createOrder({
        ticket,
        userId: 'asdfgasd',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });
    await order.save();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id,
        })
        .expect(400)
});

it('return 200, reserves a ticket', async () => {
    const ticket = TicketModel.createTicket({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
        photo_id:  "o5ekhzshydxvxixqlb3z",
        photo_url: "https://res.cloudinary.com/dvxfixf5q/image/upload/v1699898180/o5ekhzshydxvxixqlb3z.jpg",
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201)
});

it('emits an order created event',async () => {
    const ticket = TicketModel.createTicket({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
        photo_id:  "o5ekhzshydxvxixqlb3z",
        photo_url: "https://res.cloudinary.com/dvxfixf5q/image/upload/v1699898180/o5ekhzshydxvxixqlb3z.jpg",
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
