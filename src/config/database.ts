import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { RibbonProduct } from '../models/ribbon-product.model';
import { MumProduct } from '../models/mum-product.model';
import { BraidProduct } from '../models/braid-product.model';
import { WreathProduct } from '../models/wreath-product.model';
import { SeasonalProduct } from '../models/seasonal-product.model';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const config = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'budaful_door_designs_dev',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres' as const,
    logging: false
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'budaful_door_designs_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres' as const,
    logging: false
  },
  production: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    port: process.env.DB_PORT!,
    dialect: 'postgres' as const,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

const dbConfig = config[env as keyof typeof config];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: Number(dbConfig.port),
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    dialectOptions: dbConfig.dialectOptions
  }
);

// Initialize models
RibbonProduct.initModel(sequelize);
MumProduct.initModel(sequelize);
BraidProduct.initModel(sequelize);
WreathProduct.initModel(sequelize);
SeasonalProduct.initModel(sequelize);

// Export initialized models
export const models = {
  RibbonProduct,
  MumProduct,
  BraidProduct,
  WreathProduct,
  SeasonalProduct,
};

export { sequelize };

// Function to test database connection
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Function to sync database
export const syncDatabase = async (force = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};
