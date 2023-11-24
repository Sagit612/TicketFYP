import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';
declare class RequestValidationError extends CustomError {
    errors: ValidationError[];
    statusCode: number;
    constructor(errors: ValidationError[]);
    serializeErrors(): ({
        message: any;
        field: string;
    } | {
        message: any;
        field?: undefined;
    })[];
}
export { RequestValidationError };
