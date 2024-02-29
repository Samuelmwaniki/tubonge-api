import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch()
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    const errors = {};

    if (exception instanceof Array) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation failed';
      this.formatErrors(exception, errors);
    } else if (exception instanceof Error) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      //errors.general = exception.message; // Wrap general errors
    }

    response.status(status).json({
  statusCode: status,
  status: HttpStatus[status],
  message: message,
  errors: errors, // Formatted errors object
});}
  private formatErrors(errors: ValidationError[], errorObject: any) {
    errors.forEach((error) => {
      const field = error.property;
      const targetFields = ['username', 'firstname', 'lastname', 'password'];

      if (targetFields.includes(field)) {
        errorObject[field] = {
          constraints: Object.entries(error.constraints || {}).map(([key, value]) => ({
            constraint: key,
            message: value,
          })),
          children: error.children && error.children.length > 0
            ? this.formatErrors(error.children, {}) // Use a new object for children
            : undefined,
        };
      } else if (error.children && error.children.length > 0) {
        this.formatErrors(error.children, errorObject); // Recursively handle nested errors
      }
    });
  }
}
