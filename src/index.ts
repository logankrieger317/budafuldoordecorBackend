import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { sequelize } from './config/database';
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
    // Test database connection
    await sequelize.authenticate();
    
    // Quick check of essential services
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

    // Return 200 for Railway's health check
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
      error: error instanceof Error ? error.message : 'Unknown error',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };

    // Return 503 to indicate service unavailability
    res.status(503).json(healthcheck);
  }
});

// Routes
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(errorHandler);

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection successful');

    // Sync database models
    await sequelize.sync();
    console.log('Database models synchronized');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
