import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

const createOrderValidation = [
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('billingAddress').notEmpty().withMessage('Billing address is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productSku').notEmpty().withMessage('Product SKU is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('phone').optional().matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/).withMessage('Invalid phone number format'),
  body('notes').optional().isString().withMessage('Notes must be a string')
];

const updateOrderStatusValidation = [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

router.post('/', createOrderValidation, validateRequest, orderController.createOrder);
router.get('/:orderId', orderController.getOrder);
router.get('/customer/:email', orderController.getCustomerOrders);
router.patch('/:orderId/status', updateOrderStatusValidation, validateRequest, orderController.updateOrderStatus);

export default router;
