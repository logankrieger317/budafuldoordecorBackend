import { Sequelize } from 'sequelize';
import { sequelize } from '../config/database';
import { RibbonProduct } from './ribbon-product.model';
import { MumProduct } from './mum-product.model';
import { BraidProduct } from './braid-product.model';
import { WreathProduct } from './wreath-product.model';
import { SeasonalProduct } from './seasonal-product.model';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { User } from './user.model';

// Initialize models
RibbonProduct.initModel(sequelize);
MumProduct.initModel(sequelize);
BraidProduct.initModel(sequelize);
WreathProduct.initModel(sequelize);
SeasonalProduct.initModel(sequelize);
Order.initModel(sequelize);
OrderItem.initModel(sequelize);
User.initModel(sequelize);

// Define associations
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId'
});

User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders'
});

Order.belongsTo(User, {
  foreignKey: 'userId'
});

// Export initialized models
export {
  RibbonProduct,
  MumProduct,
  BraidProduct,
  WreathProduct,
  SeasonalProduct,
  Order,
  OrderItem,
  User
};
