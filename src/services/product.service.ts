import { Model, ModelStatic, WhereOptions, Op, CreationAttributes, BuildOptions } from 'sequelize';
import { RibbonProduct, MumProduct, BraidProduct, WreathProduct, SeasonalProduct } from '../models';

export enum ProductType {
  RIBBON = 'ribbon',
  MUM = 'mum',
  BRAID = 'braid',
  WREATH = 'wreath',
  SEASONAL = 'seasonal'
}

type ProductTypeToModel = {
  [ProductType.RIBBON]: RibbonProduct;
  [ProductType.MUM]: MumProduct;
  [ProductType.BRAID]: BraidProduct;
  [ProductType.WREATH]: WreathProduct;
  [ProductType.SEASONAL]: SeasonalProduct;
};

type ProductModelMap = {
  [K in ProductType]: ModelStatic<ProductTypeToModel[K]>;
};

type AnyProduct = ProductTypeToModel[ProductType];

export class ProductService {
  constructor(private readonly productModels: ProductModelMap) {}

  private getModel<T extends ProductType>(type: T): ModelStatic<ProductTypeToModel[T]> {
    return this.productModels[type];
  }

  public async getAllProductsAcrossCategories(): Promise<AnyProduct[]> {
    try {
      const allProducts = await Promise.all(
        Object.values(ProductType).map(type => 
          this.getModel(type).findAll()
        )
      );
      return allProducts.flat() as AnyProduct[];
    } catch (error) {
      console.error('Error in getAllProductsAcrossCategories:', error);
      throw error;
    }
  }

  public async getProductById<T extends ProductType>(
    type: T,
    id: string
  ): Promise<ProductTypeToModel[T] | null> {
    try {
      const model = this.getModel(type);
      const product = await model.findByPk(id);
      return product as ProductTypeToModel[T] | null;
    } catch (error) {
      console.error('Error in getProductById:', error);
      throw error;
    }
  }

  public async createProduct<T extends ProductType>(
    type: T,
    productData: CreationAttributes<ProductTypeToModel[T]>
  ): Promise<ProductTypeToModel[T]> {
    try {
      const model = this.getModel(type);
      const product = await model.create(productData);
      return product as ProductTypeToModel[T];
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  }

  public async updateProduct<T extends ProductType>(
    type: T,
    id: string,
    productData: Partial<CreationAttributes<ProductTypeToModel[T]>>
  ): Promise<ProductTypeToModel[T] | null> {
    try {
      const model = this.getModel(type);
      const [count] = await model.update(productData, {
        where: { id }
      });

      if (count === 0) {
        return null;
      }

      const updated = await model.findByPk(id);
      return updated as ProductTypeToModel[T] | null;
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  }

  public async deleteProduct(id: string): Promise<boolean> {
    try {
      for (const type of Object.values(ProductType)) {
        const model = this.getModel(type);
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

  public async searchProductsAcrossCategories(query: string): Promise<AnyProduct[]> {
    try {
      const searchCondition = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ]
      };

      const results = await Promise.all(
        Object.values(ProductType).map(type => {
          const model = this.getModel(type);
          return model.findAll({ where: searchCondition });
        })
      );

      return results.flat() as AnyProduct[];
    } catch (error) {
      console.error('Error in searchProductsAcrossCategories:', error);
      throw error;
    }
  }
}
