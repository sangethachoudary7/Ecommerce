export interface Product {
  productSku: string;
  productName: string;
  productPrice: number;
  productShortName: string;
  productDescription: string;
  createdDate: Date;
  deliveryTimeSpan: string;
  categoryId: number;
  productImageUrl: string;
  KcategoryName: string;
}

export interface ProductCategory {
  categoryId: number;
  categoryName: string;
  parentCategoryId: number;
  userId: number;
}
