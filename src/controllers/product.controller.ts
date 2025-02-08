import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import {
  RibbonProduct,
  MumProduct,
  BraidProduct,
  WreathProduct,
  SeasonalProduct,
} from '../models';

type ProductType = 'ribbon' | 'mum' | 'braid' | 'wreath' | 'seasonal';

const productService = new ProductService({
  ribbon: RibbonProduct,
  mum: MumProduct,
  braid: BraidProduct,
  wreath: WreathProduct,
  seasonal: SeasonalProduct,
});

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.getAllProductsAcrossCategories();
    res.json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ 
      error: 'Error fetching products',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ 
      error: 'Error fetching product',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.body;
    if (!type || !['ribbon', 'mum', 'braid', 'wreath', 'seasonal'].includes(type)) {
      res.status(400).json({ error: 'Invalid product type' });
      return;
    }
    const product = await productService.createProduct(type as ProductType, req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      error: 'Error creating product',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    if (!type || !['ribbon', 'mum', 'braid', 'wreath', 'seasonal'].includes(type)) {
      res.status(400).json({ error: 'Invalid product type' });
      return;
    }
    const product = await productService.updateProduct(type as ProductType, id, req.body);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      error: 'Error updating product',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await productService.deleteProduct(id);
    if (!success) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      error: 'Error deleting product',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }
    const products = await productService.searchProductsAcrossCategories(query);
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ 
      error: 'Error searching products',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
