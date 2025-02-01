import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { Database } from './models';
import { errorHandler } from './middleware/errorHandler';
import { seedProducts } from './seeders/productSeeder';

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
    
    // Finally seed if enabled
    if (process.env.SEED_DATABASE === 'true') {
      console.log('Seeding database...');
      await seedProducts();
      console.log('Database seeded successfully.');
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
