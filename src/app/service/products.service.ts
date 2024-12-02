import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import {
  AddToCart,
  ApiResponse,
  Product,
  ProductCategory,
} from '../interface/product';
import { Api, headers } from './constant/constant';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  toastr: any;

  constructor(private http: HttpClient) {}

  startLoading(isLoading: boolean) {
    setTimeout(() => {
      isLoading = false;
    }, 100);
  }

  getProducts(): Observable<{ data: Product[] }> {
    return this.http
      .get<{ data: Product[] }>(Api.API_URL + Api.METHODS.GET_ALL_PRODUCTS)
      .pipe(
        map((resp) => {
          return resp;
        }),
        catchError((err) => {
          return throwError(() => err);
        })
      );
  }
  getProductsById(productId: number): Observable<{ data: Product }> {
    console.log('Pid', productId);
    return this.http
      .get<{ data: Product }>(
        `${Api.API_URL}${Api.METHODS.GET_PRODUCT_BY_ID}?id=${productId}`
      )
      .pipe(
        map((resp) => {
          console.log('id', resp.data);
          return resp;
        }),
        catchError((err) => {
          console.log('error', err);
          return throwError(() => err);
        })
      );
  }
  public getCategory(): Observable<{ data: ProductCategory[] }> {
    return this.http
      .get<{ data: ProductCategory[] }>(
        Api.API_URL + Api.METHODS.GET_ALL_CATEGORY
      )
      .pipe(
        map((resp) => {
          return resp;
        }),
        catchError((err) => {
          return throwError(() => err);
        })
      );
  }
  public getProductsByCategoryId(
    categoryId: number
  ): Observable<{ data: Product[] }> {
    return (
      this.http
        .get<{ data: Product[] }>(
          `${Api.API_URL}${Api.METHODS.GET_PRODUCTS_BY_CATEGORY_ID}?id=${categoryId}`
        )
        // (
        // Api.API_URL + Api.METHODS.GET_PRODUCTS_BY_CATEGORY_ID + '/' + categoryId
        // )
        .pipe(
          map((resp) => {
            return resp;
          }),
          catchError((err) => {
            return throwError(() => err);
          })
        )
    );
  }
  addProduct(product: Product): Observable<ApiResponse<string>> {
    return this.http
      .post<ApiResponse<string>>(
        `${Api.API_URL}${Api.METHODS.C_PRODOCT}`,
        product
      )
      .pipe(
        map((resp) => ({
          ...resp,
          // message: resp ? resp.message : '',
        })),
        catchError((e) => {
          this.toastr.error('An error occurred while saving the product.');
          return throwError(() => e);
        })
      );
  }
  public updateProduct(product: Product): Observable<ApiResponse<string>> {
    console.log('Product update', product);
    // return this.http
    //   .post<ApiResponse<string>>(
    //     `${Api.API_URL}${Api.METHODS.U_PRODOCT}?id=${product.productId}`,
    //     headers
    //   )
    return this.http
      .post<ApiResponse<string>>(
        `${Api.API_URL}${Api.METHODS.U_PRODOCT}?id=${product.productId}`,
        product, // Pass the product object here
        { headers }
      )
      .pipe(
        // map((resp) => ({
        //   // return resp;
        //   ...resp,
        //   // console.log('product update', resp);
        // })),
        map((resp) => {
          console.log('Resp', resp);
          return resp;
        }),
        tap((resp) => {
          console.log('tap Resp', resp);
        }),
        catchError((e) => {
          return throwError(() => e);
        })
      );
  }
}
