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

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection with retry logic
    let retries = 5;
    let connected = false;
    
    while (retries > 0 && !connected) {
      try {
        await sequelize.authenticate();
        connected = true;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        // Wait 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    const healthcheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        server: 'running'
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };

    res.status(200).json(healthcheck);
  } catch (error) {
    console.error('Health check failed:', error);
    
    const healthcheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'disconnected',
        server: 'running'
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    res.status(503).json(healthcheck);
  }
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

const startServer = async () => {
  try {
    // Test database connection before starting server
    await testConnection();
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
