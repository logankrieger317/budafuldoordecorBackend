export interface OrderAttributes {
  id: string;
  userId?: string; // Optional for guest checkouts
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  billingAddress: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentIntentId?: string;
  phone?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderCreationAttributes extends Omit<OrderAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface OrderItemAttributes {
  id: string;
  orderId: string;
  productSku: string;
  quantity: number;
  priceAtTime: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface OrderItemCreationAttributes extends Omit<OrderItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UserAttributes {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Base Product Types
export interface BaseProductAttributes {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BaseProductCreationAttributes extends Omit<BaseProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Ribbon Product Types
export interface RibbonProductAttributes extends BaseProductAttributes {
  ribbonLength: string;
  ribbonWidth: string;
  ribbonColors: string[];
  ribbonPattern: string;
}

export interface RibbonProductCreationAttributes extends Omit<RibbonProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Mum Product Types
export interface MumProductAttributes extends BaseProductAttributes {
  size: 'small' | 'medium' | 'large' | 'extra-large';
  baseColors: string[];
  accentColors: string[];
  hasLights: boolean;
}

export interface MumProductCreationAttributes extends Omit<MumProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Braid Product Types
export interface BraidProductAttributes extends BaseProductAttributes {
  braidLength: string;
  braidColors: string[];
  braidPattern: string;
}

export interface BraidProductCreationAttributes extends Omit<BraidProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Wreath Product Types
export interface WreathProductAttributes extends BaseProductAttributes {
  diameter: string;
  baseType: string;
  season: string;
  decorations: string[];
}

export interface WreathProductCreationAttributes extends Omit<WreathProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Seasonal Product Types
export interface SeasonalProductAttributes extends BaseProductAttributes {
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'holiday';
  type: string;
  theme: string;
}

export interface SeasonalProductCreationAttributes extends Omit<SeasonalProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Re-export model classes
export { RibbonProduct } from '../models/ribbon-product.model';
export { MumProduct } from '../models/mum-product.model';
export { BraidProduct } from '../models/braid-product.model';
export { WreathProduct } from '../models/wreath-product.model';
export { SeasonalProduct } from '../models/seasonal-product.model';
