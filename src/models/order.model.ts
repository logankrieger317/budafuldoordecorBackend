import { Model, DataTypes, Sequelize } from 'sequelize';
import { OrderAttributes, OrderCreationAttributes } from '../types/models';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.model';

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public userId?: string;
  public customerEmail!: string;
  public customerName!: string;
  public shippingAddress!: string;
  public billingAddress!: string;
  public totalAmount!: number;
  public status!: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  public paymentStatus!: 'pending' | 'completed' | 'failed' | 'refunded';
  public paymentIntentId?: string;
  public phone?: string;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Add association methods
  public getUser!: () => Promise<User>;
  public setUser!: (user: User) => Promise<void>;

  static initModel(sequelize: Sequelize): typeof Order {
    Order.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: () => uuidv4()
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id'
          }
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
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            // Accepts formats: (123) 456-7890, 123-456-7890, 1234567890
            is: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
          }
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: true
      }
    );
    return Order;
  }

  static associate(models: any) {
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  }
}
