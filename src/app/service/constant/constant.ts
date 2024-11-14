export const Api = {
  API_URL: '/api/BigBasket/',
  METHODS: {
    LOGIN: 'Login',
    REGISTER: 'RegisterCustomer',
    GET_ALL_PRODUCTS: 'GetAllProducts',
    GET_ALL_CATEGORY: 'GetAllCategory',
    GET_PRODUCTS_BY_CATEGORY_ID: 'GetAllProductsByCategoryId',
    C_PRODOCT: 'CreateProduct',
    U_PRODOCT: 'UpdateProduct',
    D_PRODUCT: 'DeleteProductById',
    GET_PRODUCT_BY_ID: 'GetProductById',
    ALL_CART_ITEAM: 'GetAllCartItems',
    ADD_TO_CART: 'AddToCart',
    D_P_FROM_CART_BY_ID: 'DeleteProductFromByCartByID',
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
