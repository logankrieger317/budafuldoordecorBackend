import { Database } from '../models';
import { ProductCreationAttributes } from '../types/models';

const db = Database.getInstance();

const productTemplate: ProductCreationAttributes[] = [
  {
    sku: 'FD-001',          // Your custom SKU format
    name: 'Product Name 1',
    price: 299.99,
    category: 'Front Door',  // Categories: Front Door, Screen Door, Storm Door, etc.
    width: 36,              // in inches
    length: 80,             // in inches
    isWired: false,
    quantity: 10,
    description: 'Product description here',
    imageUrl: 'https://example.com/image1.jpg'  // Optional
  },
  // Add more products with unique SKUs
  // {
  //   sku: 'FD-002',
  //   name: 'Product Name 2',
  //   ...
  // }
];

export async function seedProducts() {
  try {
    console.log('Starting product seeding...');
    
    // Clear existing products (optional)
    // await db.Product.destroy({ where: {} });
    
    // Create all products
    const products = await db.Product.bulkCreate(productTemplate);
    
    console.log(`Successfully seeded ${products.length} products`);
    return products;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}

// Run seeder if this file is run directly
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log('Product seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Product seeding failed:', error);
      process.exit(1);
    });
}
