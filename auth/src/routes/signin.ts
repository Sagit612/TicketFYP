import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@sagittickets/common';
import { User } from '../models/mongooseuser.model';
import { Password } from '../services/password.service';
import { signin } from '../controllers/signin/signin.controller';

const router = express.Router();

const createEmailChain = () => body('email').isEmail().withMessage('Email must be valid!');
const createPasswordChain = () => body('password').trim().notEmpty().withMessage('Password must be provided!')

router.post('/api/users/signin',
[
    createEmailChain(),
    createPasswordChain()
], validateRequest, signin);


export { router as signinRouter }