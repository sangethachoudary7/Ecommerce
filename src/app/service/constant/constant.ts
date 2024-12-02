import { HttpHeaders } from '@angular/common/http';

export const Api = {
  API_URL: '/api/amazon/',
  // API_URL: '/api/Ecommerce/',
  // API_URL: '/api/BigBasket/',
  METHODS: {
    LOGIN: 'Login',
    REGISTER: 'RegisterCustomer',
    GET_ALL_PRODUCTS: 'GetAllProducts',
    GET_ALL_CATEGORY: 'GetAllCategory',
    GET_PRODUCTS_BY_CATEGORY_ID: 'GetAllProductsByCategoryId',
    ADD_TO_CART: 'AddToCart',
    GET_ALL_PRODUCT_BY_CUST_ID: 'GetCartProductsByCustomerId',
    D_P_FROM_CART_BY_ID: 'DeleteProductFromByCartByID',
    ALL_CART_ITEAM: 'GetAllCartItems',
    C_PRODOCT: 'CreateProduct',
    U_PRODOCT: 'UpdateProduct',
    D_PRODUCT: 'DeleteProductById',
    GET_PRODUCT_BY_ID: 'GetProductById',

    PLACE_ORDER: 'PlaceOrder',
    CANCLE_ORDER: 'cancelOrder',
    CREATE_NEW_CATEGORY: 'CreateNewCategory',
    DELETE_CATEGORY_BY_ID: 'DeleteCategoryById',
  },
};
export const LoginApi = {
  loginUrl: 'https://fakestoreapi.com/auth/',
  METHODS: {
    LOGIN: 'Login',
  },
};
export const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});

// API_URL: '/api/BigBasket/',
