import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Admin } from '../src/models/admin.model';
import { sequelize } from '../src/models';

dotenv.config();

async function createAdmin() {
  try {
    await sequelize.sync();

    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
      name: 'Admin User',
    });

    console.log('Admin user created successfully:', admin.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
}

createAdmin();
