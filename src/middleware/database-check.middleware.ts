import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../config/database';

export const databaseCheck = async (req: Request, res: Response, next: NextFunction) => {
  // Skip health check endpoint
  if (req.path === '/health') {
    return next();
  }

  try {
    // Check if database is connected
    await sequelize.authenticate();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(503).json({
      error: 'Database connection error. Please try again later.',
      status: 'error',
      timestamp: new Date().toISOString()
    });
  }
};
