import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ValidationError as SequelizeValidationError } from 'sequelize';

interface ErrorResponse {
  status: string;
  message: string;
  errors?: any[];
  stack?: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  let statusCode = 500;
  let errorResponse: ErrorResponse = {
    status: 'error',
    message: 'Internal server error'
  };

  // Handle AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorResponse = {
      status: err.status,
      message: err.message
    };
  }

  // Handle Sequelize validation errors
  if (err instanceof SequelizeValidationError) {
    statusCode = 400;
    errorResponse = {
      status: 'validation_error',
      message: 'Validation failed',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    };
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

// Handle unhandled rejections and exceptions
export const setupErrorHandling = (app: any) => {
  process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:', err);
    throw err;
  });

  process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });

  // Handle 404 errors
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      status: 'error',
      message: `Can't find ${req.originalUrl} on this server`
    });
  });

  // Global error handling middleware
  app.use(errorHandler);
};
