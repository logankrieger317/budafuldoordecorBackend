import { Database } from '../models';

const db = Database.getInstance();

const products = [
  {
    sku: 'LMK-020V56',
    name: 'silver lattice',
    width: 2.5,
    length: 10,
    color: 'silver',
    brand: '',
    price: 10,
    isWired: true,
    description: 'silver wired ribbon with lattice pattern and metallic trim/edge',
    imageUrl: 'https://res.cloudinary.com/dfszr2lob/image/upload/v1738524201/LMK-020V56_tbdc47.jpg',
    quantity: 100,
    category: 'wired-ribbon'
  },
  {
    sku: 'RGF156527',
    name: 'gold roses',
    width: 1.5,
    length: 10,
    color: 'white',
    brand: '',
    price: 9,
    isWired: true,
    description: 'white wired ribbon with stitched gold roses and trim',
    imageUrl: '',
    quantity: 100,
    category: 'wired-ribbon'
  },
  {
    sku: 'RN591502',
    name: 'black velvet',
    width: 0.625,
    length: 10,
    color: 'black',
    brand: '',
    price: 11,
    isWired: false,
    description: 'black velvet unwired ribbon',
    imageUrl: 'https://res.cloudinary.com/dfszr2lob/image/upload/v1738524207/RN591502_icwe6f.jpg',
    quantity: 100,
    category: 'velvet-ribbon'
  },
  {
    sku: 'RF1510C6',
    name: 'gold/white stripe',
    width: 2.5,
    length: 10,
    color: 'white',
    brand: 'RG',
    price: 11,
    isWired: true,
    description: 'white wired ribbon with gold stripes and polka dots',
    imageUrl: 'https://res.cloudinary.com/dfszr2lob/image/upload/v1738524205/RF1510C6_mhsorh.jpg',
    quantity: 100,
    category: 'wired-ribbon'
  },
  {
    sku: 'RGF151085',
    name: 'pink swirls',
    width: 2.5,
    length: 10,
    color: 'pink',
    brand: 'RG',
    price: 11,
    isWired: true,
    description: 'baby pink wired ribbon with hot pink and white swirls',
    imageUrl: '',
    quantity: 100,
    category: 'wired-ribbon'
  },
  {
    sku: 'JS25-903',
    name: 'pink embossed',
    width: 1.5,
    length: 10,
    color: 'pink',
    brand: '',
    price: 9,
    isWired: true,
    description: 'baby pink embossed wired ribbon',
    imageUrl: 'https://res.cloudinary.com/dfszr2lob/image/upload/v1738524201/JS25-903_q8ixig.jpg',
    quantity: 100,
    category: 'embossed-ribbon'
  },
  {
    sku: 'RN591527',
    name: 'white velvet',
    width: 0.625,
    length: 10,
    color: 'white',
    brand: '',
    price: 11,
    isWired: false,
    description: 'white velvet unwired ribbon',
    imageUrl: 'https://res.cloudinary.com/dfszr2lob/image/upload/v1738524207/RN591527_a56qmw.jpg',
    quantity: 100,
    category: 'velvet-ribbon'
  },
  {
    sku: 'RGF151087',
    name: 'black/silver stripe',
    width: 2.5,
    length: 10,
    color: 'black',
    brand: 'RG',
    price: 11,
    isWired: true,
    description: 'black wired ribbon with silver stripes and polka dots',
    imageUrl: 'https://res.cloudinary.com/dfszr2lob/image/upload/v1738524206/RGF151087_lc9uso.jpg',
    quantity: 100,
    category: 'wired-ribbon'
  },
  {
    sku: 'JS25--901',
    name: 'red embossed',
    width: 1.5,
    length: 10,
    color: 'red',
    brand: '',
    price: 9,
    isWired: true,
    description: 'red embossed wired ribbon',
    imageUrl: 'https://res.cloudinary.com/dfszr2lob/image/upload/v1738524201/JS25--901_wkfyto.jpg',
    quantity: 100,
    category: 'embossed-ribbon'
  },
  {
    sku: 'RGF151085',
    name: 'silver/white stripe',
    width: 2.5,
    length: 10,
    color: 'white',
    brand: 'RG',
    price: 11,
    isWired: true,
    description: 'white wired ribbon with silver stripes and polka dots',
    imageUrl: 'https://res.cloudinary.com/dfszr2lob/image/upload/v1738524206/RGF151085_u19i6v.jpg',
    quantity: 100,
    category: 'wired-ribbon'
  },
  {
    sku: 'RGF1510FT',
    name: 'pink/silver stripe',
    width: 2.5,
    length: 10,
    color: 'pink',
    brand: 'RG',
    price: 11,
    isWired: true,
    description: 'hot pink wired ribbon with silver stripes and polka dots',
    imageUrl: 'https://res.cloudinary.com/dfszr2lob/image/upload/v1738524206/RGF1510FT_hhtb3v.jpg',
    quantity: 100,
    category: 'wired-ribbon'
  },
  {
    sku: 'C024403',
    name: 'diamond dust #3',
    width: 0.625,
    length: 100,
    color: 'gold',
    brand: 'Berwick',
    price: 20,
    isWired: false,
    description: 'gold diamond dust ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'diamond-dust-ribbon'
  },
  {
    sku: 'C024405',
    name: 'diamond dust #9',
    width: 1.5,
    length: 100,
    color: 'gold',
    brand: 'Berwick',
    price: 24,
    isWired: false,
    description: 'gold diamond dust ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'diamond-dust-ribbon'
  },
  {
    sku: 'C024404',
    name: 'diamond dust #5',
    width: 0.875,
    length: 100,
    color: 'gold',
    brand: 'Berwick',
    price: 22,
    isWired: false,
    description: 'gold diamond dust ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'diamond-dust-ribbon'
  },
  {
    sku: 'C024408',
    name: 'diamond dust #3',
    width: 0.625,
    length: 100,
    color: 'silver',
    brand: 'Berwick',
    price: 20,
    isWired: false,
    description: 'silver diamond dust ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'diamond-dust-ribbon'
  },
  {
    sku: 'C024409',
    name: 'diamond dust #5',
    width: 0.875,
    length: 100,
    color: 'silver',
    brand: 'Berwick',
    price: 22,
    isWired: false,
    description: 'silver diamond dust ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'diamond-dust-ribbon'
  },
  {
    sku: 'C024410',
    name: 'diamond dust #9',
    width: 1.5,
    length: 100,
    color: 'silver',
    brand: 'Berwick',
    price: 24,
    isWired: false,
    description: 'silver diamond dust ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'diamond-dust-ribbon'
  },
  {
    sku: 'LMK-001A23',
    name: 'gold lattice',
    width: 2.5,
    length: 10,
    color: 'gold',
    brand: '',
    price: 10,
    isWired: true,
    description: 'gold wired ribbon with lattice pattern and metallic trim edge',
    imageUrl: 'https://res.cloudinary.com/dfszr2lob/image/upload/v1738524201/LMK-001A23_cxvtc7.jpg',
    quantity: 100,
    category: 'wired-ribbon'
  },
  {
    sku: 'LMK-002B34',
    name: 'white #16',
    width: 2,
    length: 100,
    color: 'white',
    brand: 'McGinley',
    price: 16,
    isWired: false,
    description: 'satin lustre gold label white ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'satin-ribbon'
  }
];

const mcGinleyProducts = [
  {
    sku: 'LMK-003C45',
    name: 'black #9',
    width: 1.3125,
    length: 100,
    color: 'black',
    brand: 'McGinley',
    price: 14,
    isWired: false,
    description: 'satin lustre gold label black ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'satin-ribbon'
  },
  {
    sku: 'LMK-004D56',
    name: 'white #9',
    width: 1.3125,
    length: 100,
    color: 'white',
    brand: 'McGinley',
    price: 14,
    isWired: false,
    description: 'satin lustre gold label white ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'satin-ribbon'
  },
  {
    sku: 'LMK-005E67',
    name: 'royal blue #5',
    width: 0.875,
    length: 100,
    color: 'royal blue',
    brand: 'McGinley',
    price: 10,
    isWired: false,
    description: 'satin lustre gold label royal blue ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'satin-ribbon'
  },
  {
    sku: 'LMK-006F78',
    name: 'holiday gold #5',
    width: 0.875,
    length: 100,
    color: 'gold',
    brand: 'McGinley',
    price: 10,
    isWired: false,
    description: 'satin lustre gold label holiday gold ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'satin-ribbon'
  },
  {
    sku: 'LMK-007G89',
    name: 'silver gray #5',
    width: 0.875,
    length: 100,
    color: 'gray',
    brand: 'McGinley',
    price: 10,
    isWired: false,
    description: 'satin lustre gold label silver gray ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'satin-ribbon'
  },
  {
    sku: 'LMK-008H90',
    name: 'holiday gold #9',
    width: 1.3125,
    length: 100,
    color: 'gold',
    brand: 'McGinley',
    price: 14,
    isWired: false,
    description: 'satin lustre gold label holiday gold ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'satin-ribbon'
  },
  {
    sku: 'LMK-009J12',
    name: 'white #1.5',
    width: 0.3125,
    length: 100,
    color: 'white',
    brand: 'McGinley',
    price: 10,
    isWired: false,
    description: 'silver label acetate white ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'acetate-ribbon'
  },
  {
    sku: 'LMK-010K23',
    name: 'black #1.5',
    width: 0.3125,
    length: 100,
    color: 'black',
    brand: 'McGinley',
    price: 10,
    isWired: false,
    description: 'silver label acetate black ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'acetate-ribbon'
  },
  {
    sku: 'LMK-011L34',
    name: 'royal blue #1.5',
    width: 0.3125,
    length: 100,
    color: 'royal blue',
    brand: 'McGinley',
    price: 10,
    isWired: false,
    description: 'silver label acetate royal blue ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'acetate-ribbon'
  },
  {
    sku: 'LMK-012M45',
    name: 'holiday red #1.5',
    width: 0.3125,
    length: 100,
    color: 'red',
    brand: 'McGinley',
    price: 10,
    isWired: false,
    description: 'silver label acetate holiday red ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'acetate-ribbon'
  },
  {
    sku: 'LMK-013N56',
    name: 'black #3',
    width: 0.5625,
    length: 100,
    color: 'black',
    brand: 'McGinley',
    price: 8,
    isWired: false,
    description: 'satin lustre gold label black ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'satin-ribbon'
  },
  {
    sku: 'LMK-014P67',
    name: 'holiday gold #3',
    width: 0.5625,
    length: 100,
    color: 'gold',
    brand: 'McGinley',
    price: 8,
    isWired: false,
    description: 'satin lustre gold label holiday gold ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'satin-ribbon'
  },
  {
    sku: 'LMK-015Q78',
    name: 'holiday red #3',
    width: 0.5625,
    length: 100,
    color: 'red',
    brand: 'McGinley',
    price: 8,
    isWired: false,
    description: 'satin lustre gold label holiday red ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'satin-ribbon'
  },
  {
    sku: 'LMK-016R89',
    name: 'silver gray #3',
    width: 0.5625,
    length: 100,
    color: 'gray',
    brand: 'McGinley',
    price: 8,
    isWired: false,
    description: 'satin lustre gold label silver gray ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'satin-ribbon'
  },
  {
    sku: 'LMK-017S90',
    name: 'white #3',
    width: 0.5625,
    length: 100,
    color: 'white',
    brand: 'McGinley',
    price: 8,
    isWired: false,
    description: 'satin lustre gold label white ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'satin-ribbon'
  },
  {
    sku: 'LMK-018T12',
    name: 'columbia blue #3',
    width: 0.5625,
    length: 100,
    color: 'blue',
    brand: 'McGinley',
    price: 8,
    isWired: false,
    description: 'satin lustre gold label columbia blue ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'satin-ribbon'
  },
  {
    sku: 'LMK-019U34',
    name: 'pink #3',
    width: 0.5625,
    length: 100,
    color: 'pink',
    brand: 'McGinley',
    price: 12,
    isWired: false,
    description: 'silver label acetate pink ribbon',
    imageUrl: '',
    quantity: 100,
    category: 'acetate-ribbon'
  }
];

export const seedProducts = async () => {
  try {
    console.log('Starting product seeding...');
    
    // Use upsert for each product
    for (const product of [...products, ...mcGinleyProducts]) {
      await db.Product.upsert(product);
    }
    
    console.log('Products seeded successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};

// Run seeder if this file is run directly
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
