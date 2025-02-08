import { Request, Response } from 'express';
import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const getOrderHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const orders = await Order.findAndCountAll({
      where: { userId: req.user.id },
      include: [OrderItem],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      orders: orders.rows,
      total: orders.count,
      currentPage: page,
      totalPages: Math.ceil(orders.count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order history' });
  }
};

export const getOrderDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { orderId } = req.params;
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: req.user.id
      },
      include: [OrderItem]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details' });
  }
};

export const getRecentOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const limit = parseInt(req.query.limit as string) || 5;

    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [OrderItem],
      order: [['createdAt', 'DESC']],
      limit
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent orders' });
  }
};

export const getOrderStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const totalOrders = await Order.count({
      where: { userId: req.user.id }
    });

    const totalSpent = await Order.sum('totalAmount', {
      where: { userId: req.user.id }
    });

    const recentOrders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      totalOrders,
      totalSpent,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order statistics' });
  }
};
