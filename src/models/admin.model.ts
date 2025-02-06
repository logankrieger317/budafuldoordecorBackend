import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Admin extends Model {
  declare id: string;
  declare email: string;
  declare password: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Admin.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'Admins',
    timestamps: true,
  }
);
