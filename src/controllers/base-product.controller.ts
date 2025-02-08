import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { AppError } from '../types/errors';
import { RibbonProduct, MumProduct, BraidProduct, WreathProduct, SeasonalProduct } from '../models';

type ProductType = 'ribbon' | 'mum' | 'braid' | 'wreath' | 'seasonal';

export abstract class BaseProductController {
  protected productType: ProductType;
  protected productService: ProductService;

  constructor(productType: ProductType) {
    this.productType = productType;
    this.productService = new ProductService({
      ribbon: RibbonProduct,
      mum: MumProduct,
      braid: BraidProduct,
      wreath: WreathProduct,
      seasonal: SeasonalProduct
    });
  }

  // Get all products of this type
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await this.productService.getAllProductsAcrossCategories();
      res.json(products);
    } catch (error) {
      next(new AppError(`Error fetching ${this.productType} products: ${error}`, 500));
    }
  };

  // Get a single product by ID
  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      
      if (!product) {
        next(new AppError(`${this.productType} product not found`, 404));
        return;
      }

      res.json(product);
    } catch (error) {
      next(new AppError(`Error fetching ${this.productType} product: ${error}`, 500));
    }
  };

  // Create a new product
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.createProduct(this.productType, {
        ...req.body,
        type: this.productType
      });
      res.status(201).json(product);
    } catch (error) {
      next(new AppError(`Error creating ${this.productType} product: ${error}`, 500));
    }
  };

  // Update a product
  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.updateProduct(this.productType, id, {
        ...req.body,
        type: this.productType
      });
      
      if (!product) {
        next(new AppError(`${this.productType} product not found`, 404));
        return;
      }

      res.json(product);
    } catch (error) {
      next(new AppError(`Error updating ${this.productType} product: ${error}`, 500));
    }
  };

  // Delete a product
  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.productService.deleteProduct(id);
      
      if (!success) {
        next(new AppError(`${this.productType} product not found`, 404));
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(new AppError(`Error deleting ${this.productType} product: ${error}`, 500));
    }
  };
}
