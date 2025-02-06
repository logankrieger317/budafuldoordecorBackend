import { Model, DataTypes, Sequelize } from 'sequelize';
import { BaseProductAttributes, BaseProductCreationAttributes } from '../types/models';

export class BaseProduct extends Model<BaseProductAttributes, BaseProductCreationAttributes> implements BaseProductAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public imageUrl!: string;
  public isAvailable!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
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
        isAvailable: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: 'BaseProduct',
        tableName: 'base_products',
        timestamps: true,
      }
    );
  }
}
