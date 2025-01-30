import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Validation middleware
const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('width').isFloat({ min: 0 }).withMessage('Width must be a positive number'),
  body('length').isFloat({ min: 0 }).withMessage('Length must be a positive number'),
  body('isWired').isBoolean().withMessage('isWired must be a boolean'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  validateRequest
];

const updateQuantityValidation = [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  validateRequest
];

// Routes
router.get('/', productController.getAllProducts);
router.get('/:sku', productController.getProductBySku);
router.post('/', createProductValidation, productController.createProduct);
router.patch('/:sku/quantity', updateQuantityValidation, productController.updateQuantity);
router.delete('/:sku', productController.deleteProduct);

export default router;
