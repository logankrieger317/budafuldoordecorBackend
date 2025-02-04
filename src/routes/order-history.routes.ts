import { Router } from 'express';
import { OrderHistoryController } from '../controllers/order-history.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get paginated order history
router.get('/', OrderHistoryController.getOrderHistory);

// Get specific order details
router.get('/:orderId', OrderHistoryController.getOrderDetails);

// Get recent orders (limited number)
router.get('/recent/list', OrderHistoryController.getRecentOrders);

// Get order statistics
router.get('/stats/summary', OrderHistoryController.getOrderStats);

export default router;
