import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { sequelize, testConnection } from './config/database';
import { errorHandler } from './middleware/error.middleware';
import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';
import orderRoutes from './routes/order.routes';
import adminRoutes from './routes/admin.routes';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3000;

// Track application state
let isStarting = true;
let isDatabaseConnected = false;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  // During startup, return 200 if the server is running
  if (isStarting) {
    return res.status(200).json({
      status: 'starting',
      timestamp: new Date().toISOString(),
      services: {
        server: 'running',
        database: 'initializing'
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  }

  // After startup, check database connection
  if (!isDatabaseConnected) {
    return res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        server: 'running',
        database: 'disconnected'
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  }

  // Everything is running normally
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
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

const startServer = async () => {
  // Start the server first
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Then try to connect to the database
  const connectDatabase = async () => {
    try {
      await testConnection();
      isDatabaseConnected = true;
      isStarting = false;
      console.log('Database connection established');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      isDatabaseConnected = false;
      
      // Retry connection after 5 seconds
      console.log('Retrying database connection in 5 seconds...');
      setTimeout(connectDatabase, 5000);
    }
  };

  // Start database connection process
  connectDatabase();

  // Handle shutdown gracefully
  const shutdown = async () => {
    console.log('Shutting down gracefully...');
    isDatabaseConnected = false;
    
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

startServer();
