import { Model, DataTypes, Sequelize } from 'sequelize';
import { BaseProductAttributes, BaseProductCreationAttributes } from '../types/models';

export class BaseProduct extends Model<BaseProductAttributes> implements BaseProductAttributes {
  declare id: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare imageUrl: string;
  declare quantity: number;
  declare isAvailable: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof BaseProduct {
    BaseProduct.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        isAvailable: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'products',
      }
    );
    return BaseProduct;
  }
}
