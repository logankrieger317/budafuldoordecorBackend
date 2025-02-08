import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../config/database';
import { Order, OrderItem } from '../models';
import { AuthRequest } from '../middleware/auth.middleware';

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
};

export const getUserOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const t = await sequelize.transaction();

  try {
    if (!req.user) {
      await t.rollback();
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { items, shippingAddress, billingAddress, totalAmount } = req.body;
    
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      transaction: t
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({
      shippingAddress,
      billingAddress,
      totalAmount
    }, { transaction: t });

    // Update order items
    await OrderItem.destroy({ 
      where: { orderId: order.id },
      transaction: t 
    });

    await Promise.all(
      items.map(async (item: any) => {
        return OrderItem.create({
          orderId: order.id,
          productSku: item.sku,
          quantity: item.quantity,
          priceAtTime: item.price
        }, { transaction: t });
      })
    );

    await t.commit();
    res.json(order);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

export const deleteOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const t = await sequelize.transaction();

  try {
    if (!req.user) {
      await t.rollback();
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      transaction: t
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }

    await OrderItem.destroy({
      where: { orderId: order.id },
      transaction: t
    });

    await order.destroy({ transaction: t });
    await t.commit();
    
    res.status(204).send();
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
