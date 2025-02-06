import { Model, DataTypes, Sequelize } from 'sequelize';
import { BraidProductAttributes, BraidProductCreationAttributes } from '../types/models';

export class BraidProduct extends Model<BraidProductAttributes, BraidProductCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare imageUrl: string;
  declare isAvailable: boolean;
  declare braidLength: string;
  declare braidColors: string[];
  declare braidPattern: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public static initModel(sequelize: Sequelize): typeof BraidProduct {
    BraidProduct.init(
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
        braidLength: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        braidColors: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
        },
        braidPattern: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'BraidProduct',
        tableName: 'braid_products',
        timestamps: true,
      }
    );

    return BraidProduct;
  }
}
