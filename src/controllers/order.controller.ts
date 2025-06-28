import { Request, Response } from 'express';
import { sequelize } from '../config/database';
import { Order, OrderItem } from '../models';
import { AppError } from '../types/errors';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const t = await sequelize.transaction();

  try {
    const {
      userId,
      items,
      customerEmail,
      customerName,
      shippingAddress,
      billingAddress,
      totalAmount,
      phone,
      notes
    } = req.body;

    const order = await Order.create({
      userId,
      customerEmail,
      customerName,
      shippingAddress,
      billingAddress,
      totalAmount: parseFloat(totalAmount),
      phone,
      notes,
      status: 'pending',
      paymentStatus: 'pending'
    }, { transaction: t });

    await Promise.all(
      items.map((item: any) =>
        OrderItem.create({
          orderId: order.id,
          productSku: item.productSku || item.productId,
          quantity: item.quantity,
          priceAtTime: parseFloat(item.price)
        }, { transaction: t })
      )
    );

    await t.commit();
    
    const createdOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });
    
    res.status(201).json(createdOrder);
  } catch (error) {
    await t.rollback();
    console.error('Error creating order:', error);
    throw new AppError(`Error creating order: ${error}`, 500);
  }
};

export const createGuestOrder = async (req: Request, res: Response): Promise<void> => {
  const t = await sequelize.transaction();

  try {
    const {
      items,
      customerEmail,
      customerName,
      shippingAddress,
      billingAddress,
      totalAmount,
      phone,
      notes
    } = req.body;

    const order = await Order.create({
      customerEmail,
      customerName,
      shippingAddress,
      billingAddress,
      totalAmount: parseFloat(totalAmount),
      phone,
      notes,
      status: 'pending',
      paymentStatus: 'pending'
    }, { transaction: t });

    await Promise.all(
      items.map((item: any) =>
        OrderItem.create({
          orderId: order.id,
          productSku: item.productSku,
          quantity: item.quantity,
          priceAtTime: parseFloat(item.price)
        }, { transaction: t })
      )
    );

    await t.commit();
    
    const createdOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });
    
    res.status(201).json({
      status: 'success',
      data: { order: createdOrder }
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating guest order:', error);
    throw new AppError(`Error creating guest order: ${error}`, 500);
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
    console.error('Error fetching order:', error);
    throw new AppError(`Error fetching order: ${error}`, 500);
  }
};

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new AppError(`Error fetching user orders: ${error}`, 500);
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    await order.update({ status }, { transaction: t });
    await t.commit();

    const updatedOrder = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'items' }]
    });
    
    res.json(updatedOrder);
  } catch (error) {
    await t.rollback();
    console.error('Error updating order status:', error);
    throw new AppError(`Error updating order status: ${error}`, 500);
  }
};
