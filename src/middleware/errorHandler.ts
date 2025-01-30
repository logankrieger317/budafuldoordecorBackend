import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../types/errors';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
    return;
  }

  console.error('Unhandled error:', err);
  
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};
