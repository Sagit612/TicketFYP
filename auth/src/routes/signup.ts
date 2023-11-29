import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@sagittickets/common';
import { signup } from '../controllers/signup/signup.controller';


const router = express.Router();

const createNameChain = () => body('name').trim().notEmpty().withMessage('Name must be provided!')
const createEmailChain = () => body('email').isEmail().withMessage('Email must be valid!');
const createPasswordChain = () => body('password').trim().isLength({min: 4, max: 20}).withMessage('Password must be between 4 and 20 characters')


router.post('/api/users/signup', [
    createNameChain(),
    createEmailChain(),
    createPasswordChain()
], validateRequest, signup);

export { router as signupRouter };