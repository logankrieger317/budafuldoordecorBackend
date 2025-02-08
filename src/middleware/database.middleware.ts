import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../config/database';

export const checkDatabaseConnection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Test the connection
    await sequelize.authenticate();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(503).json({
      error: 'Database connection error',
      message: 'The service is temporarily unavailable. Please try again later.'
    });
  }
};
