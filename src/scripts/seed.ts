import { syncDatabase, models } from '../config/database';

async function seedDatabase() {
  try {
    // Sync database with force: true to drop existing tables
    await syncDatabase(true);

    // Create sample ribbon products
    await models.RibbonProduct.bulkCreate([
      {
        name: 'Classic Red Ribbon',
        description: 'Beautiful red ribbon perfect for any occasion',
        price: 19.99,
        imageUrl: 'ribbons/classic-red.jpg',
        isAvailable: true,
        quantity: 50,
        ribbonLength: '3 feet',
        ribbonWidth: '2 inches',
        ribbonColors: ['red'],
        ribbonPattern: 'solid',
      },
      {
        name: 'Holiday Plaid Ribbon',
        description: 'Festive plaid ribbon for holiday decorations',
        price: 24.99,
        imageUrl: 'ribbons/holiday-plaid.jpg',
        isAvailable: true,
        quantity: 35,
        ribbonLength: '5 feet',
        ribbonWidth: '3 inches',
        ribbonColors: ['red', 'green', 'gold'],
        ribbonPattern: 'plaid',
      },
    ]);

    // Create sample mum products
    await models.MumProduct.bulkCreate([
      {
        name: 'Homecoming Special Mum',
        description: 'Traditional homecoming mum with all the trimmings',
        price: 89.99,
        imageUrl: 'mums/homecoming-special.jpg',
        isAvailable: true,
        quantity: 15,
        size: 'large',
        baseColors: ['white', 'gold'],
        accentColors: ['red', 'blue'],
        hasLights: true,
      },
      {
        name: 'Junior Mum',
        description: 'Perfect sized mum for junior high students',
        price: 49.99,
        imageUrl: 'mums/junior-mum.jpg',
        isAvailable: true,
        quantity: 25,
        size: 'medium',
        baseColors: ['purple', 'silver'],
        accentColors: ['white'],
        hasLights: false,
      },
    ]);

    // Create sample braid products
    await models.BraidProduct.bulkCreate([
      {
        name: 'Triple Twist Braid',
        description: 'Elegant triple twisted braid decoration',
        price: 34.99,
        imageUrl: 'braids/triple-twist.jpg',
        isAvailable: true,
        quantity: 40,
        braidLength: '24 inches',
        braidColors: ['gold', 'silver', 'white'],
        braidPattern: 'triple twist',
      },
    ]);

    // Create sample wreath products
    await models.WreathProduct.bulkCreate([
      {
        name: 'Spring Garden Wreath',
        description: 'Beautiful spring wreath with fresh floral design',
        price: 79.99,
        imageUrl: 'wreaths/spring-garden.jpg',
        isAvailable: true,
        quantity: 20,
        diameter: '24 inches',
        baseType: 'grapevine',
        season: 'spring',
        decorations: ['flowers', 'ribbons', 'butterflies'],
      },
    ]);

    // Create sample seasonal products
    await models.SeasonalProduct.bulkCreate([
      {
        name: 'Christmas Door Hanger',
        description: 'Festive door hanger for the holiday season',
        price: 45.99,
        imageUrl: 'seasonal/christmas-hanger.jpg',
        isAvailable: true,
        quantity: 30,
        season: 'holiday',
        type: 'door hanger',
        theme: 'Christmas',
      },
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
