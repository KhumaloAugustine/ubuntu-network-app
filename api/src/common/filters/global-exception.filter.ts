import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from '../exceptions/base.exception';

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    statusCode: number;
    timestamp: string;
    details?: Record<string, any>;
  };
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred';
    let details: Record<string, any> | undefined;

    // Handle custom exceptions
    if (exception instanceof BaseException) {
      statusCode = exception.statusCode;
      code = exception.code;
      message = exception.message;
      details = exception.details;
    }
    // Handle NestJS HTTP exceptions
    else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message =
          (exceptionResponse as any).message || exception.message || message;
        details = (exceptionResponse as any);
      } else {
        message = exceptionResponse as string;
      }
    }
    // Log unexpected errors
    else {
      console.error('Unexpected error:', exception);
      message = exception.message || 'Internal server error';
    }

    const errorResponse: ErrorResponse = {
      error: {
        code,
        message,
        statusCode,
        timestamp: new Date().toISOString(),
        ...(details && { details }),
      },
    };

    response.status(statusCode).json(errorResponse);
  }
}
