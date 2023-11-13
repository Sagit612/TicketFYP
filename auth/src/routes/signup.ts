import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@sagittickets/common';
import { User } from '../models/user';


const router = express.Router();

const createNameChain = () => body('name').trim().notEmpty().withMessage('Name must be provided!')
const createEmailChain = () => body('email').isEmail().withMessage('Email must be valid!');
const createPasswordChain = () => body('password').trim().isLength({min: 4, max: 20}).withMessage('Password must be between 4 and 20 characters')


router.post('/api/users/signup', [
    createNameChain(),
    createEmailChain(),
    createPasswordChain()
], 
validateRequest,
async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if(existingUser) {
        throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password, name });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        picture: "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"
    }, process.env.JWT_KEY!);
    // Store it on session object
    req.session = {
        jwt: userJwt
    };
    res.status(201).send(user);
});

export { router as signupRouter };