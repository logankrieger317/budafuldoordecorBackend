import { Model, DataTypes, Sequelize } from 'sequelize';
import { OrderItemAttributes, OrderItemCreationAttributes } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: string;
  public orderId!: string;
  public productSku!: string;
  public quantity!: number;
  public priceAtTime!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof OrderItem {
    OrderItem.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: () => uuidv4()
        },
        orderId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'orders',
            key: 'id'
          }
        },
        productSku: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1
          }
        },
        priceAtTime: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            min: 0
          }
        }
      },
      {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'order_items',
        timestamps: true,
      }
    );

    return OrderItem;
  }

  static associate() {
    // Association with Order will be defined in the Database class
  }
}
