import { CustomError } from './custom-error';
declare class NotFoundError extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
export { NotFoundError };
