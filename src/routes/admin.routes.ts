import { Request, Response, NextFunction, Router } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult, ValidationChain } from 'express-validator';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { User } from '../models/user.model';
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

// Admin validation schema
const adminValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('firstName')
    .isString()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .isString()
    .notEmpty()
    .withMessage('Last name is required')
];

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
    const admin = await User.findOne({ 
      where: { email, isAdmin: true },
      attributes: ['id', 'email', 'password', 'createdAt', 'updatedAt']
    });
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

// Create a new admin user
router.post('/create', authenticateAdmin, adminValidation, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const admin = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isAdmin: true
    });

    res.status(201).json({
      message: 'Admin user created successfully',
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all admin users
router.get('/', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await User.findAll({
      where: { isAdmin: true },
      attributes: ['id', 'email', 'firstName', 'lastName', 'createdAt']
    });

    res.json(admins);
  } catch (error) {
    next(error);
  }
});

// Get all admins
router.get('/admins', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await User.findAll({
      where: { isAdmin: true },
      attributes: ['id', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt']
    });
    res.json(admins);
  } catch (error) {
    next(error);
  }
});

// Delete admin
router.delete('/:id', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const admin = await User.findOne({
      where: { id, isAdmin: true }
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await admin.update({ isAdmin: false });
    res.status(200).json({ message: 'Admin privileges revoked successfully' });
  } catch (error) {
    next(error);
  }
});

// Order Management Routes
router.get('/orders', authenticateAdmin, async (req: Request, res: Response) => {
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

router.get('/orders/:id', authenticateAdmin, async (req: Request, res: Response) => {
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

router.patch('/orders/:id/status', authenticateAdmin, async (req: Request, res: Response) => {
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
