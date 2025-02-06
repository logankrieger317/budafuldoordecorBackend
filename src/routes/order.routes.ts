import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { body, ValidationChain } from 'express-validator';
import { validateRequest } from '../middleware/validation.middleware';

const router = Router();
const orderController = new OrderController();

const createOrderValidation: ValidationChain[] = [
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('billingAddress').notEmpty().withMessage('Billing address is required'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number'),
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.sku').notEmpty().withMessage('Product SKU is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isNumeric().withMessage('Price must be a number'),
  body('items.*.productType').notEmpty().withMessage('Product type is required')
];

const updateOrderStatusValidation: ValidationChain[] = [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

router.post('/', createOrderValidation, validateRequest, authenticateUser, orderController.createOrder.bind(orderController));
router.get('/', authenticateUser, orderController.getOrders.bind(orderController));
router.get('/:id', authenticateUser, orderController.getOrder.bind(orderController));
router.get('/customer/:customerEmail', authenticateUser, orderController.getCustomerOrders.bind(orderController));
router.patch('/:id/status', updateOrderStatusValidation, validateRequest, authenticateUser, orderController.updateOrderStatus.bind(orderController));

export default router;
