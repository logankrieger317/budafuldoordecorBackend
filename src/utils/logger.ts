import winston from 'winston';
import morgan from 'morgan';

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// In production, also log to files
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }));
  
  logger.add(new winston.transports.File({
    filename: 'logs/combined.log',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }));
}

// Create Morgan middleware with custom logging
const morganMiddleware = morgan('combined', {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
    }
  },
  skip: (req: any, res: any) => {
    if (process.env.NODE_ENV === 'production') {
      // In production, skip logging successful health checks
      return req.url === '/health' && res.statusCode === 200;
    }
    return false;
  }
});

export { logger, morganMiddleware };
