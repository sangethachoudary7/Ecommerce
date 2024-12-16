import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  Observable,
  map,
  catchError,
  throwError,
  Subject,
  BehaviorSubject,
} from 'rxjs';
import { ProductCategory, ApiResponse } from '../interface/product';
import { Api } from './constant/constant';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<ProductCategory[]>([]); // initial value is empty array
  public categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  updateCategorySubject(category: ProductCategory[]) {
    this.categoriesSubject.next(category);
  }
  public getCategory(): Observable<{ data: ProductCategory[] }> {
    return this.http
      .get<{ data: ProductCategory[] }>(
        Api.API_URL + Api.METHODS.GET_ALL_CATEGORY
      )
      .pipe(
        map((resp) => {
          this.updateCategorySubject(resp.data);
          return resp;
        }),
        catchError((err) => {
          return throwError(() => err);
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

  public deleteCategoryCId(cId: number): Observable<ApiResponse<string>> {
    if (Api.API_URL === '/api/amazon/') {
      // Throw a custom error message
      return throwError(
        () =>
          new Error(
            'We do not have an API for Amazon. Please change it to BigBasket or Ecommerce in the service/constant page.'
          )
      );
    }

    return this.http
      .get<ApiResponse<string>>(
        `${Api.API_URL}${Api.METHODS.DELETE_CATEGORY_BY_ID}?id=${cId}`
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
}
