import { Model, DataTypes, Sequelize } from 'sequelize';
import { WreathProductAttributes, WreathProductCreationAttributes } from '../types/models';

export class WreathProduct extends Model<WreathProductAttributes, WreathProductCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare imageUrl: string;
  declare quantity: number;
  declare isAvailable: boolean;
  declare diameter: string;
  declare baseType: string;
  declare season: string;
  declare decorations: string[];
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public static initModel(sequelize: Sequelize): typeof WreathProduct {
    WreathProduct.init(
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
        diameter: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        baseType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        season: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        decorations: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'WreathProduct',
        tableName: 'wreath_products',
        timestamps: true,
      }
    );

    return WreathProduct;
  }
}
