import { Database } from '../models';
import { ProductCreationAttributes } from '../types/models';

const db = Database.getInstance();

const productTemplate: ProductCreationAttributes[] = [
  {
    sku: 'LMK-020V56',
    name: 'silver lattice',
    price: 10.00,
    category: 'Ribbon',  
    width: 2.5,         
    length: 10,         
    isWired: true,      
    quantity: 0,        
    description: 'silver wired ribbon with lattice pattern and metallic trim/edge',
    imageUrl: "null",
    brand: '',
    color: 'silver'
  }
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
