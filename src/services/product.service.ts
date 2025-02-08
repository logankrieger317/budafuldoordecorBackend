import { Model, ModelStatic, WhereOptions, Op } from 'sequelize';
import { RibbonProduct, MumProduct, BraidProduct, WreathProduct, SeasonalProduct } from '../models';

type ProductType = 'ribbon' | 'mum' | 'braid' | 'wreath' | 'seasonal';

type ProductModel = typeof RibbonProduct | typeof MumProduct | typeof BraidProduct | typeof WreathProduct | typeof SeasonalProduct;

type ProductModelMap = {
  [K in ProductType]: ProductModel;
};

export class ProductService {
  private readonly models: ProductModel[];

  constructor(private readonly productModels: ProductModelMap) {
    this.models = Object.values(productModels);
  }

  public async getAllProductsAcrossCategories(): Promise<any[]> {
    try {
      const allProducts = await Promise.all(
        this.models.map(model => model.findAll())
      );
      
      return allProducts.flat().map(product => product.get());
    } catch (error) {
      console.error('Error in getAllProductsAcrossCategories:', error);
      throw error;
    }
  }

  public async getProductById(id: string): Promise<any | null> {
    try {
      for (const model of this.models) {
        const product = await model.findByPk(id);
        if (product) {
          return product.get();
        }
      }
      return null;
    } catch (error) {
      console.error('Error in getProductById:', error);
      throw error;
    }
  }

  public async createProduct(type: ProductType, data: any): Promise<any> {
    try {
      const model = this.productModels[type];
      if (!model) {
        throw new Error(`Invalid product type: ${type}`);
      }
      const product = await model.create(data);
      return product.get();
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  }

  public async updateProduct(type: ProductType, id: string, data: any): Promise<any | null> {
    try {
      const model = this.productModels[type];
      if (!model) {
        throw new Error(`Invalid product type: ${type}`);
      }

      const [updated] = await model.update(data, {
        where: { id },
        returning: true,
      });

      if (updated === 0) {
        return null;
      }

      const product = await model.findByPk(id);
      return product ? product.get() : null;
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  }

  public async deleteProduct(id: string): Promise<boolean> {
    try {
      for (const model of this.models) {
        const deleted = await model.destroy({ where: { id } });
        if (deleted > 0) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  }

  public async searchProductsAcrossCategories(query: string): Promise<any[]> {
    try {
      const searchCondition = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ]
      };

      const results = await Promise.all(
        this.models.map(model => 
          model.findAll({
            where: searchCondition
          })
        )
      );

      return results.flat().map(product => product.get());
    } catch (error) {
      console.error('Error in searchProductsAcrossCategories:', error);
      throw error;
    }
  }
}
