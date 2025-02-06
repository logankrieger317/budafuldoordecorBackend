import { Model, DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../config/database';

export class Admin extends Model {
  declare id: string;
  declare username: string;
  declare password: string;
  declare role: 'admin';
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admin',
    },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'admins',
    timestamps: true,
  }
);
