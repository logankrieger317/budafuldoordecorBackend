import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = Router();
const productController = new ProductController();

// Product routes
router.get('/products/:type', productController.getAllProducts.bind(productController));
router.get('/products/:type/:id', productController.getProductById.bind(productController));
router.post('/products/:type', authenticateUser, productController.createProduct.bind(productController));
router.put('/products/:type/:id', authenticateUser, productController.updateProduct.bind(productController));
router.delete('/products/:type/:id', authenticateUser, productController.deleteProduct.bind(productController));
router.get('/products/:type/search', productController.searchProducts.bind(productController));
router.get('/products', productController.getAllProductsAcrossCategories.bind(productController));
router.get('/search', productController.searchProductsAcrossCategories.bind(productController));

export default router;
