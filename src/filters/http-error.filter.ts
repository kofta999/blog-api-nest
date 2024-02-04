import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { NotPermittedError } from 'src/errors/not-permitted.error';
import { EntityNotFoundError } from 'typeorm';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = exception.criteria;
    } else if (exception instanceof NotPermittedError) {
      status = HttpStatus.FORBIDDEN;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      error: message,
    });
  }
}
