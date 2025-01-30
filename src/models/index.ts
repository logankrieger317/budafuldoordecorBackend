import { Sequelize } from 'sequelize';
import { Product } from './product.model';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import dbConfig from '../config/database';

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env as keyof typeof dbConfig];

export class Database {
  private static instance: Database;
  public sequelize: Sequelize;
  public Product: typeof Product;
  public Order: typeof Order;
  public OrderItem: typeof OrderItem;

  private constructor() {
    if (env === 'production') {
      const prodConfig = config as typeof dbConfig.production;
      const dbUrl = process.env[prodConfig.use_env_variable];
      if (!dbUrl) {
        throw new Error('DATABASE_URL environment variable is not set');
      }
      this.sequelize = new Sequelize(dbUrl, {
        dialect: 'postgres',
        dialectOptions: prodConfig.dialectOptions,
        logging: false
      });
    } else {
      const devConfig = config as typeof dbConfig.development;
      this.sequelize = new Sequelize(devConfig.database, devConfig.username, devConfig.password, {
        host: devConfig.host,
        dialect: devConfig.dialect,
        logging: process.env.NODE_ENV !== 'production'
      });
    }

    // Initialize models
    this.Product = Product.initModel(this.sequelize);
    this.Order = Order.initModel(this.sequelize);
    this.OrderItem = OrderItem.initModel(this.sequelize);

    // Set up associations
    this.Order.hasMany(this.OrderItem, {
      foreignKey: 'orderId',
      as: 'items'
    });
    this.OrderItem.belongsTo(this.Order, {
      foreignKey: 'orderId'
    });
    this.OrderItem.belongsTo(this.Product, {
      foreignKey: 'productSku',
      targetKey: 'sku'
    });
    this.Product.hasMany(this.OrderItem, {
      foreignKey: 'productSku',
      sourceKey: 'sku'
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('Database connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  }
}
