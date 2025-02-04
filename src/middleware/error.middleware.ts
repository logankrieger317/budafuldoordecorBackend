import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { ValidationError as SequelizeValidationError } from 'sequelize';

interface ErrorResponse {
  status: string;
  message: string;
  errors?: any[];
  stack?: string;
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Handle Sequelize validation errors
  if (err instanceof SequelizeValidationError) {
    return res.status(400).json({
      status: 'validation_error',
      message: 'Validation failed',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  // Send generic error response for unexpected errors
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  });
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
