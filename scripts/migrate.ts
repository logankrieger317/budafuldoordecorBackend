import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import * as colorBrandMigration from '../src/migrations/20250130_add_color_brand_to_products';

// Load environment variables
config();

async function runMigrations() {
  const sequelize = new Sequelize(process.env.DATABASE_URL!, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });

  try {
    console.log('Running migrations...');
    await colorBrandMigration.up(sequelize.getQueryInterface());
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
