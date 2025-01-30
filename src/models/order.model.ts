import { Model, DataTypes, Sequelize } from 'sequelize';
import { OrderAttributes, OrderCreationAttributes } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public customerEmail!: string;
  public customerName!: string;
  public shippingAddress!: string;
  public billingAddress!: string;
  public totalAmount!: number;
  public status!: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  public paymentStatus!: 'pending' | 'completed' | 'failed' | 'refunded';
  public paymentIntentId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Order {
    Order.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: () => uuidv4()
        },
        customerEmail: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true
          }
        },
        customerName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        shippingAddress: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        billingAddress: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        totalAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            min: 0
          }
        },
        status: {
          type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
          allowNull: false,
          defaultValue: 'pending'
        },
        paymentStatus: {
          type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
          allowNull: false,
          defaultValue: 'pending'
        },
        paymentIntentId: {
          type: DataTypes.STRING,
          allowNull: true
        }
      },
      {
        sequelize,
        tableName: 'orders',
        timestamps: true
      }
    );

    return Order;
  }
}
