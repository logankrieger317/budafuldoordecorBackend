import { Sequelize } from 'sequelize';
import { sequelize } from '../config/database';
import { RibbonProduct } from './ribbon-product.model';
import { MumProduct } from './mum-product.model';
import { BraidProduct } from './braid-product.model';
import { WreathProduct } from './wreath-product.model';
import { SeasonalProduct } from './seasonal-product.model';

// Initialize models
RibbonProduct.initModel(sequelize);
MumProduct.initModel(sequelize);
BraidProduct.initModel(sequelize);
WreathProduct.initModel(sequelize);
SeasonalProduct.initModel(sequelize);

// Define associations if needed
// For example:
// RibbonProduct.belongsTo(Category);

// Export initialized models
export {
  RibbonProduct,
  MumProduct,
  BraidProduct,
  WreathProduct,
  SeasonalProduct
};
