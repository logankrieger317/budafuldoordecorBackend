import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware';
import { getOrderHistory } from '../controllers/order-history.controller';

const router = Router();

// All routes require authentication
router.use(authenticateUser);

// Get paginated order history
router.get('/', authenticateUser, getOrderHistory);

// Get specific order details
router.get('/:orderId', getOrderHistory);

// Get recent orders (limited number)
router.get('/recent/list', getOrderHistory);

// Get order statistics
router.get('/stats/summary', getOrderHistory);

export default router;
