import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { RibbonProduct } from '../models/ribbon-product.model';
import { MumProduct } from '../models/mum-product.model';
import { BraidProduct } from '../models/braid-product.model';
import { WreathProduct } from '../models/wreath-product.model';
import { SeasonalProduct } from '../models/seasonal-product.model';

dotenv.config();

interface DbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: string | number;
  dialect: 'postgres';
  logging: boolean;
  dialectOptions?: {
    ssl?: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
  retry?: {
    max: number;
  };
}

const env = process.env.NODE_ENV || 'development';
const config: Record<string, DbConfig> = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'budaful_door_designs_dev',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      max: 5
    }
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'budaful_door_designs_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      max: 5
    }
  },
  production: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    port: process.env.DB_PORT!,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    retry: {
      max: 10
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

const dbConfig = config[env];

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: Number(dbConfig.port),
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    retry: dbConfig.retry,
    ...(dbConfig.dialectOptions && { dialectOptions: dbConfig.dialectOptions })
  }
);

// Initialize models
RibbonProduct.initModel(sequelize);
MumProduct.initModel(sequelize);
BraidProduct.initModel(sequelize);
WreathProduct.initModel(sequelize);
SeasonalProduct.initModel(sequelize);

// Export models
export const models = {
  RibbonProduct,
  MumProduct,
  BraidProduct,
  WreathProduct,
  SeasonalProduct
};

// Function to test database connection with retries
export const testConnection = async (maxRetries = 5): Promise<void> => {
  let retries = maxRetries;
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
      return;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error('Unable to connect to the database after multiple attempts:', error);
        throw error;
      }
      console.log(`Failed to connect to database. Retrying... (${retries} attempts remaining)`);
      // Wait 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
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
