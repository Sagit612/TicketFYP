import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as Payload;
    req.currentUser = payload;
  } catch (err) {}

  next();
};
export {currentUser}

interface Payload {
  id: string;
  name: string;
  email: string;
  picture: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: Payload;
    }
  }
}