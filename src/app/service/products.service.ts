import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Product } from '../interface/product';
import { Api } from './constant/constant';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}
  getProducts(): Observable<{ data: Product[] }> {
    console.log('Service');
    return this.http
      .get<{ data: Product[] }>(Api.API_URL + Api.METHODS.GET_ALL_PRODUCTS)
      .pipe(
        map((resp) => {
          console.log('map', resp);
          return resp;
        }),
        catchError((err) => {
          console.log('err', err);
          return throwError(() => err);
        })
      );
  }
}
