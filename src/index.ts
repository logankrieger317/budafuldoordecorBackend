import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { Database } from './models';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize database
const db = Database.getInstance();

// Test database connection
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

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
db.connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Unable to start server:', error);
    process.exit(1);
  });
