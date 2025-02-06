import { Model, DataTypes, Sequelize } from 'sequelize';
import { MumProductAttributes, MumProductCreationAttributes } from '../types/models';

export class MumProduct extends Model<MumProductAttributes, MumProductCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare imageUrl: string;
  declare isAvailable: boolean;
  declare size: 'small' | 'medium' | 'large' | 'extra-large';
  declare baseColors: string[];
  declare accentColors: string[];
  declare hasLights: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public static initModel(sequelize: Sequelize): typeof MumProduct {
    MumProduct.init(
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
        size: {
          type: DataTypes.ENUM('small', 'medium', 'large', 'extra-large'),
          allowNull: false,
        },
        baseColors: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
        },
        accentColors: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
        },
        hasLights: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'MumProduct',
        tableName: 'mum_products',
        timestamps: true,
      }
    );

    return MumProduct;
  }
}
