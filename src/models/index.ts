import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { RibbonProduct } from './ribbon-product.model';
import { MumProduct } from './mum-product.model';
import { BraidProduct } from './braid-product.model';
import { WreathProduct } from './wreath-product.model';
import { SeasonalProduct } from './seasonal-product.model';
import { Admin } from './admin.model';
import { BaseProduct } from './base-product.model';

// Initialize models
User.initModel(sequelize);
Order.initModel(sequelize);
OrderItem.initModel(sequelize);
RibbonProduct.initModel(sequelize);
MumProduct.initModel(sequelize);
BraidProduct.initModel(sequelize);
WreathProduct.initModel(sequelize);
SeasonalProduct.initModel(sequelize);
BaseProduct.initModel(sequelize);
Admin.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Admin',
  }
);

// Initialize associations
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items',
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
});

User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders'
});

Order.belongsTo(User, {
  foreignKey: 'userId'
});

// Export models
export {
  User,
  Order,
  OrderItem,
  RibbonProduct,
  MumProduct,
  BraidProduct,
  WreathProduct,
  SeasonalProduct,
  Admin,
  BaseProduct,
};
