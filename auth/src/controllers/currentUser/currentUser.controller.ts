import { Request, Response } from 'express';


export const checkCurrentUser = (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
}