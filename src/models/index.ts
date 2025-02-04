import { Sequelize } from 'sequelize';
import { Product } from './product.model';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { User } from './user.model';
import dbConfig from '../config/database';

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env as keyof typeof dbConfig];

export class Database {
  private static instance: Database;
  public sequelize: Sequelize;
  public User: typeof User;
  public Product: typeof Product;
  public Order: typeof Order;
  public OrderItem: typeof OrderItem;

  private constructor() {
    try {
      console.log('Initializing database with NODE_ENV:', env);
      
      if (env === 'production') {
        const prodConfig = config as typeof dbConfig.production;
        const dbUrl = process.env[prodConfig.use_env_variable];
        console.log('Database URL variable name:', prodConfig.use_env_variable);
        console.log('Database URL exists:', !!dbUrl);
        
        if (!dbUrl) {
          throw new Error('DATABASE_URL environment variable is not set');
        }
        
        console.log('Attempting to connect to database...');
        this.sequelize = new Sequelize(dbUrl, {
          dialect: 'postgres',
          dialectOptions: prodConfig.dialectOptions,
          logging: console.log
        });
      } else {
        const devConfig = config as typeof dbConfig.development;
        this.sequelize = new Sequelize(devConfig.database, devConfig.username, devConfig.password, {
          host: devConfig.host,
          dialect: devConfig.dialect,
          logging: process.env.NODE_ENV !== 'production'
        });
      }

      console.log('Initializing models...');
      // Initialize models
      this.User = User.initModel(this.sequelize);
      this.Product = Product.initModel(this.sequelize);
      this.Order = Order.initModel(this.sequelize);
      this.OrderItem = OrderItem.initModel(this.sequelize);

      // Initialize associations
      this.Product.hasMany(this.OrderItem, {
        foreignKey: 'productSku',
        sourceKey: 'sku',
      });

      this.Order.hasMany(this.OrderItem, {
        foreignKey: 'orderId',
        as: 'items',
      });

      this.OrderItem.belongsTo(this.Order, {
        foreignKey: 'orderId',
      });

      this.OrderItem.belongsTo(this.Product, {
        foreignKey: 'productSku',
        targetKey: 'sku',
      });

      // Add User-Order association
      this.User.hasMany(this.Order, {
        foreignKey: 'userId',
        as: 'orders'
      });

      this.Order.belongsTo(this.User, {
        foreignKey: 'userId'
      });

      // User associations with proper through table definition
      this.User.belongsToMany(this.Product, {
        through: {
          model: 'favorites',
          unique: true,
        },
        foreignKey: 'userId',
        otherKey: 'productSku',
        as: 'favoriteProducts',
      });

      this.Product.belongsToMany(this.User, {
        through: {
          model: 'favorites',
          unique: true,
        },
        foreignKey: 'productSku',
        otherKey: 'userId',
        as: 'favoritedBy',
      });

      console.log('Models initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async authenticate(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('Database connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  }

  public async sync(force = false): Promise<void> {
    try {
      await this.sequelize.sync({ force });
      console.log('Database synced successfully');
    } catch (error) {
      console.error('Failed to sync database:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    try {
      await this.sequelize.close();
      console.log('Database connection closed successfully');
    } catch (error) {
      console.error('Failed to close database connection:', error);
      throw error;
    }
  }
}

export const db = Database.getInstance();
export default db;
export {
  User,
  Product,
  Order,
  OrderItem,
};
