import { Model, ModelStatic, WhereOptions, Op, FindOptions } from 'sequelize';
import {
  RibbonProduct,
  MumProduct,
  BraidProduct,
  WreathProduct,
  SeasonalProduct,
  RibbonProductAttributes,
  MumProductAttributes,
  BraidProductAttributes,
  WreathProductAttributes,
  SeasonalProductAttributes,
  RibbonProductCreationAttributes,
  MumProductCreationAttributes,
  BraidProductCreationAttributes,
  WreathProductCreationAttributes,
  SeasonalProductCreationAttributes,
  BaseProductAttributes,
} from '../types/models';

type ProductType = 'ribbon' | 'mum' | 'braid' | 'wreath' | 'seasonal';

type ProductModel<T extends ProductType> = 
  T extends 'ribbon' ? typeof RibbonProduct :
  T extends 'mum' ? typeof MumProduct :
  T extends 'braid' ? typeof BraidProduct :
  T extends 'wreath' ? typeof WreathProduct :
  T extends 'seasonal' ? typeof SeasonalProduct :
  never;

type ProductAttributes<T extends ProductType> = 
  T extends 'ribbon' ? RibbonProductAttributes :
  T extends 'mum' ? MumProductAttributes :
  T extends 'braid' ? BraidProductAttributes :
  T extends 'wreath' ? WreathProductAttributes :
  T extends 'seasonal' ? SeasonalProductAttributes :
  never;

type ProductCreationAttributes<T extends ProductType> = 
  T extends 'ribbon' ? RibbonProductCreationAttributes :
  T extends 'mum' ? MumProductCreationAttributes :
  T extends 'braid' ? BraidProductCreationAttributes :
  T extends 'wreath' ? WreathProductCreationAttributes :
  T extends 'seasonal' ? SeasonalProductCreationAttributes :
  never;

type ProductModelMap = {
  [K in ProductType]: ProductModel<K>;
};

export class ProductService {
  constructor(private readonly productModels: ProductModelMap) {}

  private getModel<T extends ProductType>(type: T): ProductModel<T> {
    return this.productModels[type] as ProductModel<T>;
  }

  public async getAllProducts<T extends ProductType>(
    type: T
  ): Promise<ProductAttributes<T>[]> {
    const model = this.getModel(type);
    const products = await (model as any).findAll();
    return products.map((product: any) => product.get());
  }

  public async getProductById<T extends ProductType>(
    type: T,
    id: string
  ): Promise<ProductAttributes<T> | null> {
    const model = this.getModel(type);
    const product = await (model as any).findByPk(id);
    return product ? product.get() : null;
  }

  public async createProduct<T extends ProductType>(
    type: T,
    data: ProductCreationAttributes<T>
  ): Promise<ProductAttributes<T>> {
    const model = this.getModel(type);
    const product = await (model as any).create(data);
    return product.get();
  }

  public async updateProduct<T extends ProductType>(
    type: T,
    id: string,
    data: Partial<ProductCreationAttributes<T>>
  ): Promise<ProductAttributes<T> | null> {
    const model = this.getModel(type);
    const [updated] = await (model as any).update(data, {
      where: { id } as WhereOptions,
      returning: true,
    });

    if (updated === 0) {
      return null;
    }

    const product = await (model as any).findByPk(id);
    return product ? product.get() : null;
  }

  public async deleteProduct<T extends ProductType>(
    type: T,
    id: string
  ): Promise<boolean> {
    const model = this.getModel(type);
    const deleted = await (model as any).destroy({
      where: { id } as WhereOptions,
    });
    return deleted > 0;
  }

  public async searchProducts<T extends ProductType>(
    type: T,
    query: string
  ): Promise<ProductAttributes<T>[]> {
    const model = this.getModel(type);
    const products = await (model as any).findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
      } as WhereOptions,
    });
    return products.map((product: any) => product.get());
  }

  public async getAvailableProducts<T extends ProductType>(
    type: T
  ): Promise<ProductAttributes<T>[]> {
    const model = this.getModel(type);
    const products = await (model as any).findAll({
      where: {
        isAvailable: true,
      } as WhereOptions,
    });
    return products.map((product: any) => product.get());
  }

  public async getAllProductsAcrossCategories(): Promise<BaseProductAttributes[]> {
    const allProducts = await Promise.all(
      Object.entries(this.productModels).map(async ([type, model]) => {
        const products = await (model as any).findAll({
          where: { isAvailable: true } as WhereOptions,
        });
        return products.map((product: any) => ({
          ...product.get(),
          productType: type,
        }));
      })
    );
    return allProducts.flat();
  }

  public async searchProductsAcrossCategories(
    query: string
  ): Promise<BaseProductAttributes[]> {
    const allProducts = await Promise.all(
      Object.entries(this.productModels).map(async ([type, model]) => {
        const products = await (model as any).findAll({
          where: {
            isAvailable: true,
            [Op.or]: [
              { name: { [Op.iLike]: `%${query}%` } },
              { description: { [Op.iLike]: `%${query}%` } },
            ],
          } as WhereOptions,
        });
        return products.map((product: any) => ({
          ...product.get(),
          productType: type,
        }));
      })
    );
    return allProducts.flat();
  }
}
