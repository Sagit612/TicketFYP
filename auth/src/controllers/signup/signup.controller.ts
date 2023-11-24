import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@sagittickets/common';
import { User } from '../../models/user.model';

export const signup = async (req: Request, res: Response) => {
    const { name, email, password,  } = req.body;

    const existingUser = await User.findOne({ email });
    if(existingUser) {
        throw new BadRequestError('Email is already in use');
    }

    const newUser = User.createUser({ name, email, password});
    await newUser.save();

    const newUserJwt = jwt.sign({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        // Set default avatar for user
        picture: "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"
    }, process.env.JWT_KEY!);
    // Store jwt of user on session object
    req.session = {
        jwt: newUserJwt
    };
    res.status(201).send(newUser);
}