import bcrypt from 'bcryptjs';
import { Admin } from '../models/admin.model';

export async function seedAdmin() {
  try {
    const adminUsername = process.env.ADMIN_EMAIL?.split('@')[0] || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      where: { username: adminUsername }
    });

    if (!existingAdmin) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Create admin user
      await Admin.create({
        username: adminUsername,
        password: hashedPassword
      });

      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
    throw error;
  }
}
