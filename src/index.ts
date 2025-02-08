import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { sequelize, testConnection } from './config/database';
import { errorHandler } from './middleware/error.middleware';
import { databaseCheck } from './middleware/database-check.middleware';
import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';
import orderRoutes from './routes/order.routes';
import adminRoutes from './routes/admin.routes';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3000;

// Track application state
let isDatabaseConnected = false;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    isDatabaseConnected = true;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        server: 'running',
        database: 'connected'
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    isDatabaseConnected = false;
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        server: 'running',
        database: 'disconnected'
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Database connection check middleware for all routes
app.use(databaseCheck);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

const startServer = async () => {
  let retries = 10;
  
  // Try to establish initial database connection
  while (retries > 0) {
    try {
      await testConnection();
      isDatabaseConnected = true;
      console.log('Database connection established');
      break;
    } catch (error) {
      retries--;
      console.error(`Failed to connect to database. ${retries} attempts remaining:`, error);
      
      if (retries === 0) {
        console.error('Failed to establish initial database connection');
        process.exit(1);
      }
      
      // Wait 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // Start server only after successful database connection
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Handle shutdown gracefully
  const shutdown = async () => {
    console.log('Shutting down gracefully...');
    
    try {
      await sequelize.close();
      console.log('Database connections closed');
    } catch (error) {
      console.error('Error closing database connections:', error);
    }

    server.close(() => {
      console.log('Server stopped');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
