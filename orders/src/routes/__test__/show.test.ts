import request from 'supertest';
import { app } from '../../app';
import { TicketModel, } from '../../models/central';
import mongoose from 'mongoose';

it('fetches the order', async () => {
  // Create a ticket
  const ticket = TicketModel.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
    photo_id:  "o5ekhzshydxvxixqlb3z",
    photo_url: "https://res.cloudinary.com/dvxfixf5q/image/upload/v1699898180/o5ekhzshydxvxixqlb3z.jpg",
  });
  await ticket.save();

  const user = global.signin();
  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  // Create a ticket
  const ticket = TicketModel.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
    photo_id:  "o5ekhzshydxvxixqlb3z",
    photo_url: "https://res.cloudinary.com/dvxfixf5q/image/upload/v1699898180/o5ekhzshydxvxixqlb3z.jpg",

  });
  await ticket.save();

  const user = global.signin();
  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
