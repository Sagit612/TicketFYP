import { CustomError } from './custom-error';
declare class DatabaseConnectionError extends CustomError {
    statusCode: number;
    reason: string;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
export { DatabaseConnectionError };
