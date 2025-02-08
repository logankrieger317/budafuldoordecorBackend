import { Request, Response } from 'express';
import { sequelize } from '../config/database';
import { Order, OrderItem } from '../models/order.model';
import { AppError } from '../types/errors';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const t = await sequelize.transaction();

  try {
    const { userId, items } = req.body;

    const order = await Order.create({
      userId,
      status: 'pending'
    }, { transaction: t });

    await Promise.all(
      items.map((item: any) =>
        OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }, { transaction: t })
      )
    );

    await t.commit();
    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    throw new AppError(`Error creating order: ${error}`, 500);
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.json(order);
  } catch (error) {
    throw new AppError(`Error fetching order: ${error}`, 500);
  }
};

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, as: 'items' }]
    });

    res.json(orders);
  } catch (error) {
    throw new AppError(`Error fetching user orders: ${error}`, 500);
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    await order.update({ status });
    res.json(order);
  } catch (error) {
    throw new AppError(`Error updating order status: ${error}`, 500);
  }
};
