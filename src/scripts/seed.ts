import { sequelize, syncDatabase } from '../config/database';
import { RibbonProduct, MumProduct, BraidProduct, WreathProduct, SeasonalProduct } from '../models';

async function seedDatabase() {
  try {
    // Sync database with force: true to drop existing tables
    await syncDatabase(true);

    // Seed ribbon products
    await RibbonProduct.create({
      name: 'Classic Red Ribbon',
      description: 'Beautiful classic red ribbon for any occasion',
      price: 19.99,
      imageUrl: 'https://example.com/ribbon1.jpg',
      ribbonLength: '3 feet',
      ribbonWidth: '2 inches',
      ribbonColors: ['red'],
      ribbonPattern: 'solid',
      quantity: 100,
      isAvailable: true
    });

    // Seed mum products
    await MumProduct.create({
      name: 'Homecoming Special Mum',
      description: 'Perfect for homecoming celebrations',
      price: 49.99,
      imageUrl: 'https://example.com/mum1.jpg',
      size: 'large',
      baseColors: ['white', 'gold'],
      accentColors: ['red', 'blue'],
      hasLights: true,
      hasBells: true,
      hasFeathers: true,
      quantity: 50,
      isAvailable: true
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
