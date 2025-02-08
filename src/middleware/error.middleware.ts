import { Request, Response, NextFunction } from 'express';
import { ValidationError as ExpressValidationError } from 'express-validator';

interface CustomError extends Error {
  statusCode?: number;
  errors?: ExpressValidationError[];
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // Handle validation errors
  if (err.errors && Array.isArray(err.errors)) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map(error => ({
        field: error.type === 'field' ? error.location + '.' + error.path : error.type,
        message: error.msg
      }))
    });
  }

  // Handle known errors with status codes
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  // Handle unknown errors
  res.status(500).json({
    message: 'Internal server error'
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
