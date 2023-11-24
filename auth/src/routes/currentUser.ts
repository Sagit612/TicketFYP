import express from 'express';
import { currentUser } from '@sagittickets/common';
import { checkCurrentUser } from '../controllers/currentUser/currentUser.controller';


const router = express.Router();

router.get('/api/users/currentuser', currentUser, checkCurrentUser);

export { router as currentUserRouter };