import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

export interface UserAttributes {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public phone?: string;
  public isAdmin!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Add any custom instance methods here
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public static initModel(sequelize: Sequelize): typeof User {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
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
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
        },
        isAdmin: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        hooks: {
          beforeSave: async (user: User) => {
            if (user.changed('password')) {
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(user.password, salt);
            }
          },
        },
      }
    );

    return User;
  }

  static associate(models: any) {
    User.hasMany(models.Order, {
      foreignKey: 'userId',
      as: 'orders'
    });
  }
}

export default User;
