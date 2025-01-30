import { Model, DataTypes, Sequelize } from 'sequelize';
import { ProductAttributes, ProductCreationAttributes } from '../types/models';

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public sku!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public imageUrl!: string;
  public category!: string;
  public width!: number;
  public length!: number;
  public isWired!: boolean;
  public quantity!: number;
  public color!: string;
  public brand!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Product {
    Product.init(
      {
        sku: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        category: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        width: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        length: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        isWired: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        color: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        brand: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: true,
      }
    );

    return Product;
  }
}
