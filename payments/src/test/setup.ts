import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
    var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper.ts');

process.env.STRIPE_KEY = 'sk_test_51O9S1CBW5Tv4OB2kY4N6FY2NZYy4GeT4sj2XCVImAT3VCRRGXgXL8MKzytJk1jTCRpuv7M3NKAuiQfOXu3c8Runa005chODWWx'

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdf'
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections){
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
      await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    // Build a JWT payload. {id, email}
    const userId = (id) ? id : new mongoose.Types.ObjectId().toHexString();
    const payload = {
        id: userId,
        email: 'test@test.com'
    }
    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    // Build session Object. { jwt: MY_JWT}
    const session = { jwt: token };
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
    // return a string thats the cookie with the encoded data
    return [`session=${base64}`];
}