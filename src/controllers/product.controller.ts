import { Request, Response } from 'express';
import { Database } from '../models';
import { asyncHandler } from '../middleware/asyncHandler';
import { NotFoundError, ValidationError } from '../types/errors';
import { ProductCreationAttributes } from '../types/models';

const db = Database.getInstance();

export const productController = {
  // Get all products
  getAllProducts: asyncHandler(async (req: Request, res: Response) => {
    const products = await db.Product.findAll();
    res.json(products);
  }),

  // Get product by SKU
  getProductBySku: asyncHandler(async (req: Request, res: Response) => {
    const { sku } = req.params;
    const product = await db.Product.findByPk(sku);
    
    if (!product) {
      throw new NotFoundError(`Product with SKU ${sku} not found`);
    }
    
    res.json(product);
  }),

  // Create new product
  createProduct: asyncHandler(async (req: Request, res: Response) => {
    const productData: ProductCreationAttributes = req.body;
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'category', 'width', 'length', 'isWired'];
    for (const field of requiredFields) {
      if (!(field in productData)) {
        throw new ValidationError(`Missing required field: ${field}`);
      }
    }

    // Generate SKU if not provided
    if (!productData.sku) {
      productData.sku = await generateUniqueSku(productData.name);
    }

    const product = await db.Product.create(productData);
    res.status(201).json(product);
  }),

  // Update product quantity
  updateQuantity: asyncHandler(async (req: Request, res: Response) => {
    const { sku } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 0) {
      throw new ValidationError('Invalid quantity value');
    }

    const product = await db.Product.findByPk(sku);
    if (!product) {
      throw new NotFoundError(`Product with SKU ${sku} not found`);
    }

    product.quantity = quantity;
    await product.save();

    res.json(product);
  }),

  // Delete product
  deleteProduct: asyncHandler(async (req: Request, res: Response) => {
    const { sku } = req.params;
    
    const product = await db.Product.findByPk(sku);
    if (!product) {
      throw new NotFoundError(`Product with SKU ${sku} not found`);
    }

    await product.destroy();
    res.status(204).send();
  })
};

// Helper function to generate unique SKU
async function generateUniqueSku(name: string): Promise<string> {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 3)
    .toUpperCase();
    
  const timestamp = Date.now().toString().slice(-4);
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${base}-${timestamp}-${randomNum}`;
}
