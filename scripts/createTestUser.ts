import { Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../src/models/user.model';

dotenv.config();

async function createTestUser() {
  // Use Railway DATABASE_URL if available, otherwise local development URL
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/budaful_door_designs_dev';
  
  console.log('Connecting to database...');
  
  // Create sequelize connection
  const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: process.env.DATABASE_URL ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    logging: false
  });

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Initialize the User model
    User.initModel(sequelize);

    // Sync models
    await sequelize.sync();

    const email = 'test@test.com';
    const password = 'test123';

    // Check if user already exists (case-insensitive)
    const existingUser = await User.findOne({ 
      where: { 
        email: { 
          [require('sequelize').Op.iLike]: email 
        } 
      } 
    });

    if (existingUser) {
      console.log('Test user already exists, updating password...');
      const hashedPassword = await bcrypt.hash(password, 10);
      await existingUser.update({
        password: hashedPassword
      });
      console.log('Test user password updated successfully');
    } else {
      const user = await User.create({
        email,
        password, // Let the model hash it via the beforeSave hook
        firstName: 'Test',
        lastName: 'User',
        isAdmin: false
      });
      console.log('Test user created successfully:', user.email);
    }
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await sequelize.close();
  }
}

createTestUser();