import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { Database } from './models';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import { errorHandler } from './middleware/errorHandler';
import { seedProducts } from './seeders/productSeeder';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize database
const db = Database.getInstance();

// Test database connection and initialize
async function initializeDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Run database sync
    await db.sequelize.sync();
    
    // Check if we should seed the database
    if (process.env.SEED_DATABASE === 'true') {
      console.log('Seeding database...');
      await seedProducts();
      console.log('Database seeded successfully.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
