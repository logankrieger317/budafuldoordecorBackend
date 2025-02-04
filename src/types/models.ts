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

export interface ProductAttributes {
  sku: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category: string;
  width: number;
  length: number;
  isWired: boolean;
  color?: string;
  brand?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes extends Omit<ProductAttributes, 'createdAt' | 'updatedAt'> {}

export interface OrderItemAttributes {
  id: string;
  orderId: string;
  productSku: string;
  quantity: number;
  priceAtTime: number;
  createdAt?: Date;
  updatedAt?: Date;
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

export interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'phone'> {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isAdmin: boolean;
}
