import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@sagittickets/common';
import { User } from '../../models/user.model';
import { Password } from '../../services/password.service';
export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError('Invalid credentials');
    }
    if (!existingUser.password) {
        throw new BadRequestError('Invalid credentials');
    }
    const passwordMatch = await Password.compare(existingUser.password, password);
    if (!passwordMatch) {
        throw new BadRequestError('Invalid credentials');
    }
    // Generate JWT
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        picture: "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"
    }, process.env.JWT_KEY!);
    // Store it on session object
    req.session = {
        jwt: userJwt
    };
    res.status(201).send(existingUser);
}