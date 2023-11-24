import { Request, Response } from 'express';
export declare const errorHandler: (err: Error, req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
