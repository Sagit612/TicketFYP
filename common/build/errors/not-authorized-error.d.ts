import { CustomError } from './custom-error';
declare class NotAuthorizedError extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
export { NotAuthorizedError };
