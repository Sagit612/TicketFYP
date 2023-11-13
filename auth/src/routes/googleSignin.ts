import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@sagittickets/common';
import { User } from '../models/user';
import { Password } from '../services/password';
import { getGoogleOauthToken, getGoogleUser } from '../services/google.service';

const router = express.Router();

router.get('/api/users/oauth/google', async (req: Request, res: Response) => {
    try {
        const code = req.query.code as string;
        if (!code) {
            throw new BadRequestError('Invalid Credentials!') 
        }
        const { id_token, access_token } = await getGoogleOauthToken(code);
        const {id, email, verified_email, name, picture} = await getGoogleUser({
            id_token,
            access_token
        });
        const existingUser = await User.findAndCreate(
            {
                googleId: id
            }, 
            {
                email: email,
                verified_email: verified_email,
                name: name,
                picture: picture,
            }, {
                new: true,
                upsert: true
            });
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            picture: existingUser.picture
        }, process.env.JWT_KEY!);
        req.session = {
            jwt: userJwt
        };
        res.redirect('https://ticketing.dev')
    } catch (err: any) {

    }
}

);

export { router as googleSigninRouter };



//     res.status(201).send(email);