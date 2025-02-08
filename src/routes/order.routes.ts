import { Router } from 'express';
import { body, ValidationChain } from 'express-validator';
import { authenticateUser } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { 
  createOrder, 
  getUserOrders, 
  getOrder, 
  updateOrder, 
  deleteOrder 
} from '../controllers/order.controller';

const router = Router();

// Order validation schemas
const orderValidation: ValidationChain[] = [
  body('items')
    .isArray()
    .withMessage('Items must be an array')
    .notEmpty()
    .withMessage('At least one item is required'),
  body('items.*.productSku')
    .isString()
    .notEmpty()
    .withMessage('Product SKU is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('shippingAddress')
    .isObject()
    .withMessage('Shipping address must be an object'),
  body('shippingAddress.street')
    .isString()
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .isString()
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .isString()
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.zipCode')
    .isString()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Valid ZIP code is required'),
  body('billingAddress')
    .isObject()
    .withMessage('Billing address must be an object'),
  body('billingAddress.street')
    .isString()
    .notEmpty()
    .withMessage('Street address is required'),
  body('billingAddress.city')
    .isString()
    .notEmpty()
    .withMessage('City is required'),
  body('billingAddress.state')
    .isString()
    .notEmpty()
    .withMessage('State is required'),
  body('billingAddress.zipCode')
    .isString()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Valid ZIP code is required'),
  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  body('customerName')
    .isString()
    .notEmpty()
    .withMessage('Customer name is required'),
  body('customerEmail')
    .isEmail()
    .withMessage('Valid customer email is required')
];

// Routes
router.post('/', authenticateUser, validate(orderValidation), createOrder);
router.get('/', authenticateUser, getUserOrders);
router.get('/:id', authenticateUser, getOrder);
router.put('/:id', authenticateUser, validate(orderValidation), updateOrder);
router.delete('/:id', authenticateUser, deleteOrder);

export default router;
