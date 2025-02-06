import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { Admin, Order, OrderItem } from '../models';
import { validateRequest } from '../middleware/validation.middleware';
import { authenticateAdmin } from '../middleware/auth.middleware';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const router = Router();

interface AdminLoginRequest extends Request {
  body: {
    username: string;
    password: string;
  }
}

// Admin Login
router.post('/login', async (req: AdminLoginRequest, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcryptjs.compare(password, admin.get('password'));

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: admin.get('id'), username: admin.get('username'), role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      admin: {
        id: admin.get('id'),
        username: admin.get('username')
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all admins
router.get('/', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await Admin.findAll({
      attributes: ['id', 'username', 'createdAt', 'updatedAt']
    });
    res.json(admins);
  } catch (error) {
    next(error);
  }
});

// Create new admin
router.post('/', authenticateAdmin, [
  body('username').notEmpty().withMessage('Username is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
], validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const admin = await Admin.create({
      username,
      password: hashedPassword
    });

    const adminResponse = {
      id: admin.get('id'),
      username: admin.get('username'),
      createdAt: admin.get('createdAt'),
      updatedAt: admin.get('updatedAt')
    };

    res.status(201).json(adminResponse);
  } catch (error) {
    next(error);
  }
});

// Delete admin
router.delete('/:id', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await admin.destroy();
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Order Management Routes
router.get('/orders', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.get('/orders/:id', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

router.patch('/orders/:id/status', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status });
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
