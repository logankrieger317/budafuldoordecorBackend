import { QueryInterface } from 'sequelize';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function up(queryInterface: QueryInterface) {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  
  await queryInterface.bulkInsert('admins', [{
    id: uuidv4(),
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: hashedPassword,
    name: 'Admin User',
    createdAt: new Date(),
    updatedAt: new Date()
  }]);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('admins', {});
}
