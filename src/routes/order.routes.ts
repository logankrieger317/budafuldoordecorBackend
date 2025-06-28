import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateUser } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createOrder,
  createGuestOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus
} from '../controllers/order.controller';

const router = Router();

// Order validation schema
const orderValidation = [
  body('userId').isUUID().withMessage('Valid user ID is required'),
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.productId').isUUID().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('billingAddress').notEmpty().withMessage('Billing address is required'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number')
];

const guestOrderValidation = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.productSku').notEmpty().withMessage('Product SKU is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isNumeric().withMessage('Price must be a number'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('billingAddress').notEmpty().withMessage('Billing address is required'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number')
];

const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

// Routes
router.post('/guest', validate(guestOrderValidation), createGuestOrder);
router.post('/', authenticateUser, validate(orderValidation), createOrder);
router.get('/user/:userId', authenticateUser, getUserOrders);
router.get('/:id', authenticateUser, getOrderById);
router.patch('/:id/status', authenticateUser, validate(updateStatusValidation), updateOrderStatus);

export default router;
