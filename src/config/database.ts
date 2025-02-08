import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
let sequelize: Sequelize;

if (process.env.DATABASE_URL) {
  console.log('Using DATABASE_URL for connection');
  // Use connection URL if available (Railway provides this)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: console.log, // Enable SQL query logging
    pool: {
      max: 10,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  });
} else {
  console.log('Using individual connection parameters');
  // Use individual connection parameters
  sequelize = new Sequelize({
    database: process.env.DB_NAME || 'budaful_door_designs_dev',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: console.log, // Enable SQL query logging
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

// Function to test database connection with retries
export const testConnection = async (maxRetries = 5): Promise<void> => {
  let retries = maxRetries;
  let lastError: Error | null = null;

  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
      return;
    } catch (error) {
      lastError = error as Error;
      console.error('Connection error details:', lastError);
      retries--;
      if (retries === 0) break;
      
      console.log(`Failed to connect to database. Retrying... (${retries} attempts remaining)`);
      // Wait 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.error('Unable to connect to the database after multiple attempts:', lastError);
  throw lastError;
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

// Export the sequelize instance
export { sequelize };
