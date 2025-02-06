import { Request, Response, NextFunction } from 'express';
import { Database } from '../models';
import { AppError } from '../types/errors';
import { Transaction } from 'sequelize';

const db = Database.getInstance();

export const orderController = {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    console.log('Received order data:', req.body);
    
    const {
      customerEmail,
      customerName,
      shippingAddress,
      billingAddress,
      items,
      phone,
      notes,
      totalAmount,
      userId
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(new AppError('Order must contain at least one item', 400));
    }

    let transaction: Transaction | undefined;

    try {
      transaction = await db.sequelize.transaction();

      // Create the order
      const order = await db.Order.create({
        customerEmail,
        customerName,
        shippingAddress,
        billingAddress,
        phone,
        notes,
        totalAmount,
        userId,
        status: 'pending',
        paymentStatus: 'pending'
      }, { transaction });

      // Create order items
      const orderItems = items.map(item => ({
        orderId: order.id,
        productSku: item.productSku,
        quantity: item.quantity,
        priceAtTime: item.price
      }));

      await db.OrderItem.bulkCreate(orderItems, { transaction });

      await transaction.commit();
      console.log('Order created successfully:', order.toJSON());

      res.status(201).json({
        message: 'Order created successfully',
        orderId: order.id
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      next(error);
    }
  },

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;

      const order = await db.Order.findByPk(orderId, {
        include: [{
          model: db.OrderItem,
          as: 'items'
        }]
      });

      if (!order) {
        return next(new AppError('Order not found', 404));
      }

      res.json(order);
    } catch (error) {
      next(error);
    }
  },

  async getCustomerOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;

      const orders = await db.Order.findAll({
        where: { customerEmail: email },
        include: [{
          model: db.OrderItem,
          as: 'items'
        }],
        order: [['createdAt', 'DESC']]
      });

      res.json(orders);
    } catch (error) {
      next(error);
    }
  },

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await db.Order.findByPk(orderId);
      
      if (!order) {
        return next(new AppError('Order not found', 404));
      }

      await order.update({ status });

      res.json({ message: 'Order status updated successfully' });
    } catch (error) {
      next(error);
    }
  }
};
