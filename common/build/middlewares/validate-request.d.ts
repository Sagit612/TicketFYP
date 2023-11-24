import { Request, Response, NextFunction } from 'express';
declare const validateRequest: (req: Request, res: Response, next: NextFunction) => void;
export { validateRequest };
