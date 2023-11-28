import request from 'supertest';
import { app } from '../../app';
import { TicketModel, OrderModel } from '../../models/central';
import { OrderStatus } from '../../models/order.model';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
  // create a ticket with Ticket Model
  const ticket = TicketModel.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
    photo_id:  "o5ekhzshydxvxixqlb3z",
    photo_url: "https://res.cloudinary.com/dvxfixf5q/image/upload/v1699898180/o5ekhzshydxvxixqlb3z.jpg",
  });
  await ticket.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await OrderModel.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
  // create a ticket with Ticket Model
  const ticket = TicketModel.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
    photo_id:  "o5ekhzshydxvxixqlb3z",
    photo_url: "https://res.cloudinary.com/dvxfixf5q/image/upload/v1699898180/o5ekhzshydxvxixqlb3z.jpg",
  });
  await ticket.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
