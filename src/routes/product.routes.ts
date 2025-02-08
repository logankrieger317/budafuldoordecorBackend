import { Router } from 'express';
import { body, ValidationChain } from 'express-validator';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { checkDatabaseConnection } from '../middleware/database.middleware';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';
import { RibbonProduct, MumProduct, BraidProduct, WreathProduct, SeasonalProduct } from '../models';
import { ProductType } from '../services/product.service';

const router = Router();

// Initialize controller
const productService = new ProductService({
  [ProductType.RIBBON]: RibbonProduct,
  [ProductType.MUM]: MumProduct,
  [ProductType.BRAID]: BraidProduct,
  [ProductType.WREATH]: WreathProduct,
  [ProductType.SEASONAL]: SeasonalProduct,
});
const productController = new ProductController(productService);

// Base product validation
const baseProductValidation: ValidationChain[] = [
  body('name')
    .isString()
    .notEmpty()
    .withMessage('Product name is required'),
  body('description')
    .isString()
    .notEmpty()
    .withMessage('Product description is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('imageUrl')
    .isURL()
    .withMessage('Valid image URL is required'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('isAvailable')
    .isBoolean()
    .withMessage('Availability status must be a boolean')
];

// Routes
router.get('/', checkDatabaseConnection, productController.getAllProducts.bind(productController));
router.get('/search', checkDatabaseConnection, productController.searchProducts.bind(productController));
router.get('/:id', checkDatabaseConnection, productController.getProductById.bind(productController));

router.post(
  '/:type',
  authenticateAdmin,
  checkDatabaseConnection,
  validate(baseProductValidation),
  productController.createProduct.bind(productController)
);

router.put(
  '/:type/:id',
  authenticateAdmin,
  checkDatabaseConnection,
  validate(baseProductValidation),
  productController.updateProduct.bind(productController)
);

router.delete(
  '/:id',
  authenticateAdmin,
  checkDatabaseConnection,
  productController.deleteProduct.bind(productController)
);

export default router;
