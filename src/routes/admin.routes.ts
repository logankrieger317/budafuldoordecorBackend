import { Request, Response, NextFunction, Router } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { adminAuth } from '../middleware/adminAuth';
import { Admin } from '../models/admin.model';
import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';

const router = Router();

interface AdminLoginRequest extends Request {
  body: {
    email: string;
    password: string;
  }
}

// Validation middleware
const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Admin Login
router.post('/login', async (req: AdminLoginRequest, res: Response) => {
  try {
    console.log('Login attempt:', {
      email: req.body.email,
      headers: req.headers,
      body: req.body
    });

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing credentials');
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Find admin user
    const admin = await Admin.findOne({ where: { email } });
    console.log('Admin found:', admin ? 'yes' : 'no');

    if (!admin) {
      console.log('Admin not found');
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const validPassword = await bcryptjs.compare(password, admin.get('password'));
    console.log('Password valid:', validPassword);

    if (!validPassword) {
      console.log('Invalid password');
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.get('id'), email: admin.get('email') },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    console.log('Login successful');
    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.get('id'),
        email: admin.get('email')
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all admins
router.get('/', adminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await Admin.findAll({
      attributes: ['id', 'email', 'createdAt', 'updatedAt']
    });
    res.json(admins);
  } catch (error) {
    next(error);
  }
});

// Create new admin
router.post('/', 
  adminAuth,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/\d/)
      .withMessage('Password must contain a number')
      .matches(/[A-Z]/)
      .withMessage('Password must contain an uppercase letter'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const existingAdmin = await Admin.findOne({ where: { email } });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      const admin = await Admin.create({
        email,
        password: hashedPassword
      });

      const adminResponse = {
        id: admin.get('id'),
        email: admin.get('email'),
        createdAt: admin.get('createdAt'),
        updatedAt: admin.get('updatedAt')
      };

      res.status(201).json(adminResponse);
    } catch (error) {
      next(error);
    }
  }
);

// Delete admin
router.delete('/:id', adminAuth, async (req: Request, res: Response, next: NextFunction) => {
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
router.get('/orders', adminAuth, async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      include: [OrderItem],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.get('/orders/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [OrderItem]
    });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

router.patch('/orders/:id/status', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    await order.update({ status });
    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

export default router;
