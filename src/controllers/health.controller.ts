import { Request, Response } from 'express';
import { db } from '../models';
import { logger } from '../utils/logger';

export class HealthController {
  static async check(req: Request, res: Response) {
    try {
      // Check database connection
      await db.authenticate();

      const healthcheck = {
        status: 'healthy',
        timestamp: new Date(),
        services: {
          database: 'connected',
          server: 'running'
        },
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
      };

      logger.info('Health check passed', healthcheck);
      res.status(200).json(healthcheck);
    } catch (error) {
      logger.error('Health check failed', error);
      
      const healthcheck = {
        status: 'unhealthy',
        timestamp: new Date(),
        services: {
          database: error instanceof Error ? error.message : 'disconnected',
          server: 'running'
        },
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
      };

      res.status(503).json(healthcheck);
    }
  }
}
