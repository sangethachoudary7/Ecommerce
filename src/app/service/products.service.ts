import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ApiResponse, Product, ProductCategory } from '../interface/product';
import { Api, headers } from './constant/constant';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient, private toastr: ToastrService) {}

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
  getProductsByProId(productId: number): Observable<{ data: Product }> {
    return this.http
      .get<{ data: Product }>(
        `${Api.API_URL}${Api.METHODS.GET_PRODUCT_BY_P_ID}?id=${productId}`
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
    return this.http
      .get<{ data: Product[] }>(
        `${Api.API_URL}${Api.METHODS.GET_PRODUCTS_BY_CATEGORY_ID}?id=${categoryId}`
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
  addProduct(product: Product): Observable<ApiResponse<string>> {
    return this.http
      .post<ApiResponse<string>>(
        `${Api.API_URL}${Api.METHODS.C_PRODOCT}`,
        product
      )
      .pipe(
        map((resp) => ({
          ...resp,
        })),
        catchError((e) => {
          this.toastr.error('An error occurred while saving the product.');
          return throwError(() => e);
        })
      );
  }
  public updateProduct(product: Product): Observable<ApiResponse<string>> {
    return this.http
      .post<ApiResponse<string>>(
        `${Api.API_URL}${Api.METHODS.U_PRODOCT}?id=${product.productId}`,
        product, // Pass the product object here
        { headers }
      )
      .pipe(
        map((resp) => {
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

  public deleteProductByPid(pId: number): Observable<ApiResponse<string>> {
    return this.http
      .get<ApiResponse<string>>(
        `${Api.API_URL}${Api.METHODS.D_PRODUCT_BY_P_ID}?id=${pId}`
      )
      .pipe(
        map((resp: ApiResponse<string>) => {
          if (resp.message === null) {
            throw new Error('No message returned from API');
          }
          return resp;
        }),
        catchError((e) => {
          return throwError(() => e);
        })
      );
  }

  public createCategory(
    category: ProductCategory
  ): Observable<ApiResponse<string>> {
    return this.http
      .post<ApiResponse<string>>(
        `${Api.API_URL}${Api.METHODS.C_CATEGORY}`,
        category
      )
      .pipe(
        map((resp) => {
          return resp;
        }),
        catchError((e) => {
          return throwError(() => e);
        })
      );
  }
}
