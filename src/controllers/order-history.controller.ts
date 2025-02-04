import { Request, Response } from 'express';
import { Order, OrderItem, Product } from '../models';

export class OrderHistoryController {
  static async getOrderHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const orders = await Order.findAndCountAll({
        where: { userId },
        include: [{
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            attributes: ['sku', 'name', 'imageUrl', 'price']
          }]
        }],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      const totalPages = Math.ceil(orders.count / limit);

      res.json({
        orders: orders.rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: orders.count,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      console.error('Get order history error:', error);
      res.status(500).json({ message: 'Error fetching order history' });
    }
  }

  static async getOrderDetails(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { orderId } = req.params;

      const order = await Order.findOne({
        where: {
          id: orderId,
          userId, // Ensure the order belongs to the user
        },
        include: [{
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            attributes: ['sku', 'name', 'imageUrl', 'price', 'description']
          }]
        }],
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      console.error('Get order details error:', error);
      res.status(500).json({ message: 'Error fetching order details' });
    }
  }

  static async getRecentOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const limit = parseInt(req.query.limit as string) || 5;

      const orders = await Order.findAll({
        where: { userId },
        include: [{
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            attributes: ['sku', 'name', 'imageUrl', 'price']
          }]
        }],
        order: [['createdAt', 'DESC']],
        limit,
      });

      res.json(orders);
    } catch (error) {
      console.error('Get recent orders error:', error);
      res.status(500).json({ message: 'Error fetching recent orders' });
    }
  }

  static async getOrderStats(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const totalOrders = await Order.count({
        where: { userId }
      });

      const totalSpent = await Order.sum('totalAmount', {
        where: { userId }
      });

      const ordersByStatus = await Order.count({
        where: { userId },
        group: ['status']
      });

      res.json({
        totalOrders,
        totalSpent: totalSpent || 0,
        ordersByStatus
      });
    } catch (error) {
      console.error('Get order stats error:', error);
      res.status(500).json({ message: 'Error fetching order statistics' });
    }
  }
}
