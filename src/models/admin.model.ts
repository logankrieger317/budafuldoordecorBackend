import { Model, DataTypes, Sequelize } from 'sequelize';
import { Database } from './index';

export class Admin extends Model {
  public id!: string;
  public email!: string;
  public password!: string;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize) {
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
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Admin',
        tableName: 'admins',
      }
    );
  }
}

// Initialize the model with the database instance
const db = Database.getInstance();
Admin.initialize(db.sequelize);
