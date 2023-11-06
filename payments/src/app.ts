import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import cors from 'cors';
import { errorHandler, NotFoundError } from '@sagittickets/common';
import { currentUser, requireAuth } from '@sagittickets/common';

import { createChargeRouter } from './routes/new';
// import { showTicketRouter } from './routes/show';
// import { indexTicketRouter } from './routes';
// import { updateTicketRouter } from './routes/update';

const app = express();
app.use(cors());
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);

app.use(currentUser);

app.use(createChargeRouter);
// app.use(showTicketRouter);
// app.use(indexTicketRouter);
// app.use(updateTicketRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};