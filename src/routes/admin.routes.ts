import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminAuth } from '../middleware/adminAuth';
import { Admin } from '../models/admin.model';
import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';
import { Database } from '../models';

const router: Router = express.Router();
const db = Database.getInstance();

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

// Admin Login
router.post('/login', async (req: LoginRequest, res: Response): Promise<void> => {
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
    const validPassword = await bcrypt.compare(password, admin.password);
    console.log('Password valid:', validPassword);

    if (!validPassword) {
      console.log('Invalid password');
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    console.log('Login successful');
    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Order Management Routes
router.get('/orders', adminAuth, async (req: Request, res: Response): Promise<void> => {
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

router.get('/orders/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
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

router.patch('/orders/:id/status', adminAuth, async (req: Request, res: Response): Promise<void> => {
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
