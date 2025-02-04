import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { Database } from './models';
import { errorHandler } from './middleware/errorHandler';
import { seedProducts } from './seeders/productSeeder';
import { seedAdmin } from './seeders/adminSeeder';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3000;
const db = Database.getInstance();

// Test database connection and initialize
async function initializeDatabase() {
  try {
    // Test the connection
    console.log('Testing database connection...');
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // First, ensure the database is synced with the current models
    console.log('Syncing database...');
    await db.sequelize.sync({ force: false, alter: false });
    console.log('Database sync completed');
    
    // Always seed admin user for initial setup
    console.log('Ensuring admin user exists...');
    await seedAdmin();
    
    // Finally seed products if enabled
    if (process.env.SEED_DATABASE === 'true') {
      console.log('Seeding products...');
      await seedProducts();
      console.log('Products seeded successfully.');
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Initialize database
initializeDatabase();

// Configure CORS
const corsOptions = {
  origin: ['https://budafuldoordecor.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    
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
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
