import { Request, Response } from 'express';
import { sequelize } from '../config/database';

export class HealthController {
  async check(req: Request, res: Response) {
    try {
      await sequelize.authenticate();
      res.json({ 
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({ 
        status: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
