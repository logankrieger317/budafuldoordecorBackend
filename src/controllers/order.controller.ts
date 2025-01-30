import { Request, Response, NextFunction } from 'express';
import { Database } from '../models';
import { AppError } from '../types/errors';
import { Transaction } from 'sequelize';

const db = Database.getInstance();

export const orderController = {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    const {
      customerEmail,
      customerName,
      shippingAddress,
      billingAddress,
      items
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(new AppError('Order must contain at least one item', 400));
    }

    let transaction: Transaction | undefined;

    try {
      transaction = await db.sequelize.transaction();

      // Calculate total amount and verify product availability
      let totalAmount = 0;
      for (const item of items) {
        const product = await db.Product.findByPk(String(item.productSku), { transaction });
        
        if (!product) {
          throw new AppError(`Product with SKU ${item.productSku} not found`, 404);
        }

        if (product.quantity < Number(item.quantity)) {
          throw new AppError(`Insufficient quantity for product ${product.name}`, 400);
        }

        totalAmount += Number(product.price) * Number(item.quantity);

        // Update product quantity
        await product.update(
          { quantity: product.quantity - Number(item.quantity) },
          { transaction }
        );
      }

      // Create order
      const order = await db.Order.create(
        {
          customerEmail,
          customerName,
          shippingAddress,
          billingAddress,
          totalAmount,
          status: 'pending',
          paymentStatus: 'pending'
        },
        { transaction }
      );

      // Create order items
      const orderItems = await Promise.all(
        items.map(item =>
          db.OrderItem.create(
            {
              orderId: order.id,
              productSku: String(item.productSku),
              quantity: Number(item.quantity),
              priceAtTime: Number(item.price)
            },
            { transaction }
          )
        )
      );

      await transaction.commit();

      res.status(201).json({
        status: 'success',
        data: {
          order: {
            ...order.toJSON(),
            items: orderItems
          }
        }
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      next(error);
    }
  },

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await db.Order.findByPk(String(req.params.orderId), {
        include: [{
          model: db.OrderItem,
          as: 'items',
          include: [{
            model: db.Product,
            as: 'product'
          }]
        }]
      });

      if (!order) {
        return next(new AppError('Order not found', 404));
      }

      res.json({
        status: 'success',
        data: { order }
      });
    } catch (error) {
      next(error);
    }
  },

  async getCustomerOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await db.Order.findAll({
        where: { customerEmail: req.params.customerEmail },
        include: [{
          model: db.OrderItem,
          as: 'items',
          include: [{
            model: db.Product,
            as: 'product'
          }]
        }]
      });

      res.json({
        status: 'success',
        data: { orders }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await db.Order.findByPk(String(req.params.orderId));

      if (!order) {
        return next(new AppError('Order not found', 404));
      }

      await order.update({ status: req.body.status });

      res.json({
        status: 'success',
        data: { order }
      });
    } catch (error) {
      next(error);
    }
  }
};
