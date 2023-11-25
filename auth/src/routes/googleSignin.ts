import express from 'express';

import { googleSignin } from '../controllers/googleSignin/googleSignin.controller';

const router = express.Router();

router.get('/api/users/oauth/google', googleSignin);

export { router as googleSigninRouter };
