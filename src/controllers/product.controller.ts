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

export class ProductController {
  private readonly productService: ProductService;

  constructor() {
    this.productService = new ProductService({
      ribbon: RibbonProduct,
      mum: MumProduct,
      braid: BraidProduct,
      wreath: WreathProduct,
      seasonal: SeasonalProduct,
    });
  }

  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params as { type: ProductType };
      const products = await this.productService.getAllProducts(type);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching products' });
    }
  }

  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { type, id } = req.params as { type: ProductType; id: string };
      const product = await this.productService.getProductById(type, id);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching product' });
    }
  }

  public async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params as { type: ProductType };
      const product = await this.productService.createProduct(type, req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error creating product' });
    }
  }

  public async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { type, id } = req.params as { type: ProductType; id: string };
      const product = await this.productService.updateProduct(type, id, req.body);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error updating product' });
    }
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { type, id } = req.params as { type: ProductType; id: string };
      const deleted = await this.productService.deleteProduct(type, id);
      if (!deleted) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting product' });
    }
  }

  public async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params as { type: ProductType };
      const { query } = req.query as { query: string };
      const products = await this.productService.searchProducts(type, query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error searching products' });
    }
  }

  public async getAllProductsAcrossCategories(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const products = await this.productService.getAllProductsAcrossCategories();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching all products' });
    }
  }

  public async searchProductsAcrossCategories(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { query } = req.query as { query: string };
      const products = await this.productService.searchProductsAcrossCategories(query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error searching products' });
    }
  }
}
