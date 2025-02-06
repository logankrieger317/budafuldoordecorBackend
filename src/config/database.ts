import { Sequelize } from 'sequelize';
import { RibbonProduct } from '../models/ribbon-product.model';
import { MumProduct } from '../models/mum-product.model';
import { BraidProduct } from '../models/braid-product.model';
import { WreathProduct } from '../models/wreath-product.model';
import { SeasonalProduct } from '../models/seasonal-product.model';

let sequelize: Sequelize;

// Check if we have a DATABASE_URL (Railway) or individual connection params
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'budaful_door_designs',
    logging: false,
  });
}

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
export async function testConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

// Function to sync database
export async function syncDatabase(force = false): Promise<void> {
  try {
    await sequelize.sync({ force });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
}
