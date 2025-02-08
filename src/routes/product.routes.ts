import { Router } from 'express';
import { body, ValidationChain } from 'express-validator';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { checkDatabaseConnection } from '../middleware/database.middleware';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from '../controllers/product.controller';

const router = Router();

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
    .isString()
    .notEmpty()
    .withMessage('Image URL is required'),
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('type')
    .isString()
    .notEmpty()
    .withMessage('Product type is required')
    .isIn(['ribbon', 'mum', 'braid', 'wreath', 'seasonal'])
    .withMessage('Invalid product type')
];

// Type-specific validation
const ribbonProductValidation: ValidationChain[] = [
  ...baseProductValidation,
  body('ribbonLength')
    .isString()
    .notEmpty()
    .withMessage('Ribbon length is required'),
  body('ribbonWidth')
    .isString()
    .notEmpty()
    .withMessage('Ribbon width is required'),
  body('ribbonColors')
    .isArray()
    .withMessage('Ribbon colors must be an array')
    .notEmpty()
    .withMessage('At least one ribbon color is required'),
  body('ribbonPattern')
    .isString()
    .notEmpty()
    .withMessage('Ribbon pattern is required')
];

// Apply database connection check to all routes
router.use(checkDatabaseConnection);

// Public routes
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Protected routes (admin only)
router.post('/', authenticateAdmin, validate(ribbonProductValidation), createProduct);
router.put('/:id', authenticateAdmin, validate(ribbonProductValidation), updateProduct);
router.delete('/:id', authenticateAdmin, deleteProduct);

export default router;
