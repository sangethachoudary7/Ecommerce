import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Product, ProductCategory } from '../interface/product';
import { Api } from './constant/constant';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
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
  getProductsById(id: Product): Observable<{ data: Product[] }> {
    return this.http
      .get<{ data: Product[] }>(
        `${Api.API_URL}${Api.METHODS.GET_PRODUCT_BY_ID}?id=${id.productId}`
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
}
