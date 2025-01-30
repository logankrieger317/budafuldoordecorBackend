export interface ProductAttributes {
  sku: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
  width: number;
  length: number;
  isWired: boolean;
  quantity: number;
  color?: string;
  brand?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes extends Omit<ProductAttributes, 'createdAt' | 'updatedAt'> {}

export interface OrderAttributes {
  id: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  billingAddress: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentIntentId?: string;
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
}

export interface OrderItemCreationAttributes extends Omit<OrderItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
