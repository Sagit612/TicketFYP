import { Request, Response, NextFunction } from 'express';
declare const currentUser: (req: Request, res: Response, next: NextFunction) => void;
export { currentUser };
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
