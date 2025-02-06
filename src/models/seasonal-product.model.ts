import { Model, DataTypes, Sequelize } from 'sequelize';
import { SeasonalProductAttributes, SeasonalProductCreationAttributes } from '../types/models';

export class SeasonalProduct extends Model<SeasonalProductAttributes, SeasonalProductCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare imageUrl: string;
  declare isAvailable: boolean;
  declare season: 'spring' | 'summer' | 'fall' | 'winter' | 'holiday';
  declare type: string;
  declare theme: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public static initModel(sequelize: Sequelize): typeof SeasonalProduct {
    SeasonalProduct.init(
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
        season: {
          type: DataTypes.ENUM('spring', 'summer', 'fall', 'winter', 'holiday'),
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        theme: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'SeasonalProduct',
        tableName: 'seasonal_products',
        timestamps: true,
      }
    );

    return SeasonalProduct;
  }
}
