import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import {
  RibbonProduct,
  MumProduct,
  BraidProduct,
  WreathProduct,
  SeasonalProduct,
} from '../types/models';

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
    const { type } = req.params as { type: ProductType };
    const products = await productService.getAllProducts(type);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, id } = req.params as { type: ProductType; id: string };
    const product = await productService.getProductById(type, id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.params as { type: ProductType };
    const product = await productService.createProduct(type, req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, id } = req.params as { type: ProductType; id: string };
    const product = await productService.updateProduct(type, id, req.body);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, id } = req.params as { type: ProductType; id: string };
    const deleted = await productService.deleteProduct(type, id);
    if (!deleted) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
};

export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.params as { type: ProductType };
    const { query } = req.query as { query: string };
    const products = await productService.searchProducts(type, query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error searching products' });
  }
};

export const getAllProductsAcrossCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.getAllProductsAcrossCategories();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching all products' });
  }
};

export const searchProductsAcrossCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query as { query: string };
    const products = await productService.searchProductsAcrossCategories(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error searching products' });
  }
};
