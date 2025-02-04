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
      totalAmount
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(new AppError('Order must contain at least one item', 400));
    }

    let transaction: Transaction | undefined;

    try {
      transaction = await db.sequelize.transaction();

      // Calculate total amount and verify product availability
      let calculatedTotal = 0;
      for (const item of items) {
        console.log('Processing item:', item);
        const product = await db.Product.findByPk(String(item.productSku), { transaction });

        if (!product) {
          throw new AppError(`Product with SKU ${item.productSku} not found`, 404);
        }

        console.log('Found product:', product.toJSON());

        if (product.quantity < Number(item.quantity)) {
          throw new AppError(`Insufficient quantity for product ${product.name}`, 400);
        }

        calculatedTotal += Number(product.price) * Number(item.quantity);

        // Update product quantity
        await product.update(
          { quantity: product.quantity - Number(item.quantity) },
          { transaction }
        );
      }

      console.log('Calculated total:', calculatedTotal);
      console.log('Received totalAmount:', totalAmount);

      // Verify the totals match (within a small margin for floating point precision)
      const receivedTotal = Number(totalAmount);
      if (Math.abs(calculatedTotal - receivedTotal) > 0.01) {
        throw new AppError('Order total mismatch', 400);
      }

      // Create order with number values
      const order = await db.Order.create(
        {
          customerEmail,
          customerName,
          shippingAddress,
          billingAddress,
          totalAmount: calculatedTotal,
          status: 'pending',
          paymentStatus: 'pending',
          phone,
          notes
        },
        { transaction }
      );

      // Create order items with number values
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

      // Format numbers as strings only in the response
      const orderJSON = order.toJSON();
      const formattedOrder = {
        ...orderJSON,
        totalAmount: Number(orderJSON.totalAmount).toFixed(2),
        items: orderItems.map(item => ({
          ...item.toJSON(),
          priceAtTime: Number(item.priceAtTime).toFixed(2)
        }))
      };

      res.status(201).json({
        status: 'success',
        data: {
          order: formattedOrder
        }
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error('Error creating order:', error);
      if (error instanceof AppError) {
        next(error);
      } else if (error instanceof Error) {
        console.error('Stack trace:', error.stack);
        next(new AppError(error.message || 'Internal server error', 500));
      } else {
        next(new AppError('Internal server error', 500));
      }
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
      const customerEmail = req.params.customerEmail;
      console.log('Fetching orders for customer:', customerEmail);
      
      if (!customerEmail) {
        throw new AppError('Customer email is required', 400);
      }

      const orders = await db.Order.findAll({
        where: { customerEmail },
        include: [{
          model: db.OrderItem,
          as: 'items',
          include: [{
            model: db.Product,
            attributes: ['name', 'price', 'imageUrl']
          }]
        }],
        order: [['createdAt', 'DESC']] // Show newest orders first
      });

      console.log('Found orders:', orders.length);
      
      res.json({
        status: 'success',
        data: { orders }
      });
    } catch (error) {
      console.error('Error fetching customer orders:', error);
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
