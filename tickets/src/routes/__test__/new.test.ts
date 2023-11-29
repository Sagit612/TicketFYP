import request from 'supertest';
import { app } from '../../app';
import { TicketModel } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';

const photo = "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"


it('has a route handler listening to /api/tickets for post requests',async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});
    
    expect(response.status).not.toEqual(404);
});

it('returns 404 error, can only be accessed if the user is signed in',async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in',async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({});

    console.log(response.status);
    expect(response.status).not.toEqual(401);
});

it('returns an 400 error if an invalid title is provided',async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10,
            // photo
        })
        .expect(400);
});

it('returns an 400 error if an invalid price is provided',async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'asdf',
        price: -10,
        // photo
    })
    .expect(400);
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'asdf',
    })
    .expect(400);
});

it('return 201, creates a ticket with valid input',async () => {
    let tickets = await TicketModel.find({})
    expect(tickets.length).toEqual(0);
    const title = 'asdf'

    // add in a check to make sure a ticket was saved
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: title,
        price: 20,
        // photo
    })
    .expect(201);

    tickets = await TicketModel.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual(title);
});

it('publishes an event', async () => {
    const title = 'asdf'

    // add in a check to make sure a ticket was saved
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: title,
        price: 20,
        // photo
    })
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})

