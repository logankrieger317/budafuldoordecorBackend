import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { testConnection, models } from './config/database';
import { ProductController } from './controllers/product.controller';

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Initialize controllers
const productController = new ProductController();

// Product routes
app.get('/api/products/:type', productController.getAllProducts.bind(productController));
app.get('/api/products/:type/:id', productController.getProductById.bind(productController));
app.post('/api/products/:type', productController.createProduct.bind(productController));
app.put('/api/products/:type/:id', productController.updateProduct.bind(productController));
app.delete('/api/products/:type/:id', productController.deleteProduct.bind(productController));
app.get('/api/products/:type/search', productController.searchProducts.bind(productController));
app.get('/api/products', productController.getAllProductsAcrossCategories.bind(productController));
app.get('/api/search', productController.searchProductsAcrossCategories.bind(productController));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await testConnection();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
