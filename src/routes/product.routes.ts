import { Router } from 'express';
import { body, ValidationChain } from 'express-validator';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getAllProductsAcrossCategories,
  searchProductsAcrossCategories
} from '../controllers/product.controller';

const router = Router();

// Product validation schema
const productValidation: ValidationChain[] = [
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
  body('sku')
    .isString()
    .notEmpty()
    .withMessage('SKU is required'),
  body('category')
    .isString()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['ribbon', 'mum', 'braid', 'wreath', 'seasonal'])
    .withMessage('Invalid product category'),
  body('imageUrl')
    .isString()
    .notEmpty()
    .withMessage('Image URL is required')
    .isURL()
    .withMessage('Invalid image URL'),
  body('stockQuantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer')
];

// Public routes
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/all', getAllProductsAcrossCategories);
router.get('/search/all', searchProductsAcrossCategories);
router.get('/:id', getProductById);

// Protected routes (admin only)
router.post('/', authenticateAdmin, validate(productValidation), createProduct);
router.put('/:id', authenticateAdmin, validate(productValidation), updateProduct);
router.delete('/:id', authenticateAdmin, deleteProduct);

export default router;
