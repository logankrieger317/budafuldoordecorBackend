import { Request, Response } from 'express';
import { ProductService, ProductType } from '../services/product.service';
import { AppError } from '../types/errors';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getAllProductsAcrossCategories();
      res.json(products);
    } catch (error) {
      console.error('Error getting all products:', error);
      throw new AppError(`Error getting all products: ${error}`, 500);
    }
  }

  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { type } = req.query;

      if (!type || typeof type !== 'string' || !Object.values(ProductType).includes(type as ProductType)) {
        throw new AppError('Invalid product type', 400);
      }

      const product = await this.productService.getProductById(type as ProductType, id);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      res.json(product);
    } catch (error) {
      console.error('Error getting product by id:', error);
      throw new AppError(`Error getting product by id: ${error}`, 500);
    }
  }

  public async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const productData = req.body;

      if (!type || !Object.values(ProductType).includes(type as ProductType)) {
        throw new AppError('Invalid product type', 400);
      }

      const product = await this.productService.createProduct(type as ProductType, productData);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new AppError(`Error creating product: ${error}`, 500);
    }
  }

  public async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id, type } = req.params;
      const productData = req.body;

      if (!type || !Object.values(ProductType).includes(type as ProductType)) {
        throw new AppError('Invalid product type', 400);
      }

      const product = await this.productService.updateProduct(type as ProductType, id, productData);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      throw new AppError(`Error updating product: ${error}`, 500);
    }
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.productService.deleteProduct(id);

      if (!deleted) {
        throw new AppError('Product not found', 404);
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new AppError(`Error deleting product: ${error}`, 500);
    }
  }

  public async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.query;

      if (!query || typeof query !== 'string') {
        throw new AppError('Search query is required', 400);
      }

      const products = await this.productService.searchProductsAcrossCategories(query);
      res.json(products);
    } catch (error) {
      console.error('Error searching products:', error);
      throw new AppError(`Error searching products: ${error}`, 500);
    }
  }
}
