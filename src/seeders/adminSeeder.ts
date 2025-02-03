import bcrypt from 'bcryptjs';
import { Admin } from '../models/admin.model';

export async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      where: { email: 'admin@budafuldoordecor.com' }
    });

    if (!existingAdmin) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      // Create admin user
      await Admin.create({
        email: 'admin@budafuldoordecor.com',
        password: hashedPassword,
        name: 'Admin User'
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
