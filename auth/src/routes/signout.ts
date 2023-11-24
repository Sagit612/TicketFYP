import express from 'express';
import { signout } from '../controllers/signout/signout.controller';

const router = express.Router();

router.post('/api/users/signout', signout);

export { router as signoutRouter };