import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../config/database';
import { Order, OrderItem } from '../models';
import { AuthRequest } from '../middleware/auth.middleware';

export class OrderController {
  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    const t = await sequelize.transaction();

    try {
      if (!req.user) {
        await t.rollback();
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const { items, shippingAddress, billingAddress, customerName, customerEmail, totalAmount } = req.body;

      const order = await Order.create({
        userId: req.user.id,
        customerEmail,
        customerName,
        shippingAddress,
        billingAddress,
        totalAmount,
        status: 'pending',
        paymentStatus: 'pending'
      }, { transaction: t });

      await Promise.all(
        items.map(async (item: any) => {
          return OrderItem.create({
            orderId: order.get('id'),
            productSku: item.sku,
            quantity: item.quantity,
            priceAtTime: item.price
          }, { transaction: t });
        })
      );

      await t.commit();
      res.status(201).json(order);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  async getOrders(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, as: 'items' }]
    });

    res.json(orders);
  }

  async getOrder(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const order = await Order.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  }

  async getCustomerOrders(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { customerEmail } = req.params;
    const orders = await Order.findAll({
      where: { customerEmail },
      include: [{ model: OrderItem, as: 'items' }]
    });

    res.json(orders);
  }

  async updateOrderStatus(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status });
    res.json({ message: 'Order status updated successfully' });
  }
}
