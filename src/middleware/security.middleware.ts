import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { Express } from 'express';
import { RateLimitError } from '../utils/errors';

export const setupSecurity = (app: Express) => {
  // Basic security headers
  app.use(helmet());

  // CORS configuration
  const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // Replace with your frontend URL in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 600 // 10 minutes
  };
  app.use(cors(corsOptions));

  // Rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: 'Too many login attempts, please try again later',
    handler: (req, res) => {
      throw new RateLimitError('Too many login attempts, please try again later');
    }
  });
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);

  // General rate limiting for all other routes
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    handler: (req, res) => {
      throw new RateLimitError('Too many requests, please try again later');
    }
  });
  app.use('/api', apiLimiter);

  // Security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
};
