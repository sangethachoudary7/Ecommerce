export interface Product {
  productId: number;
  productSku: string;
  productName: string;
  productPrice: number;
  productShortName: string;
  productDescription: string;
  createdDate: Date;
  deliveryTimeSpan: string;
  categoryId: number;
  productImageUrl: string;
  categoryName?: string;
  // quantity?: number;
  custId?: number;
  // cartId?: number;
}

export interface ProductCategory {
  categoryId: number;
  categoryName: string;
  parentCategoryId: number;
  userId: number;
}

export interface AddToCart {
  cartId: number;
  custId: number;
  productId: number;
  quantity: number;
  addedDate: string;
  productShortName?: string;
  productName?: string;
  categoryName?: string;
  productImageUrl?: string;
  productPrice?: number;
}
export interface ApiResponse<T> {
  message: string | null;
  result: boolean;
  data: T | null;
}
