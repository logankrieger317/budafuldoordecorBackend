import { Model, DataTypes, Sequelize } from 'sequelize';
import { RibbonProductAttributes, RibbonProductCreationAttributes } from '../types/models';

export class RibbonProduct extends Model<RibbonProductAttributes, RibbonProductCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare imageUrl: string;
  declare isAvailable: boolean;
  declare ribbonLength: string;
  declare ribbonWidth: string;
  declare ribbonColors: string[];
  declare ribbonPattern: string;
  declare quantity: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public static initModel(sequelize: Sequelize): typeof RibbonProduct {
    RibbonProduct.init(
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
        isAvailable: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        ribbonLength: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        ribbonWidth: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        ribbonColors: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
        },
        ribbonPattern: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: 'RibbonProduct',
        tableName: 'ribbon_products',
        timestamps: true,
      }
    );

    return RibbonProduct;
  }
}
