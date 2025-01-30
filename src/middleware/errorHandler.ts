import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../types/errors';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
    return;
  }

  // Provide more details in development mode
  if (process.env.NODE_ENV !== 'production') {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: err.message,
      stack: err.stack
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};
