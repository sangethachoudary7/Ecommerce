import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  tap,
  catchError,
  throwError,
  Observable,
  BehaviorSubject,
  map,
  of,
} from 'rxjs';
import { Api, headers } from './constant/constant';
import { AddToCart, ApiResponse } from '../interface/product';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartQuantitySubject = new BehaviorSubject<number>(0);
  cartQuantity$ = this.cartQuantitySubject.asObservable();

  private cartVisibleSubject = new BehaviorSubject<boolean>(false);
  cartVisible$ = this.cartVisibleSubject.asObservable();

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  toggleCartVisibility() {
    const currenState = this.cartQuantitySubject.value;
    this.cartVisibleSubject.next(!currenState);
    console.log('subValue', currenState);
  }
  public addToCart(cartData: AddToCart): Observable<ApiResponse<string>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<ApiResponse<string>>(
        Api.API_URL + Api.METHODS.ADD_TO_CART,
        cartData,
        {
          headers,
        }
      )
      .pipe(
        tap((resp) => {
          if (resp && resp.result) {
            this.getCartItems(cartData.custId);
          }
        }),
        catchError((e) => {
          this.toastr.error('API request failed:', e); // Log any error
          return throwError(() => e);
        })
      );
  }

  public resetCart() {
    this.cartQuantitySubject.next(0);
  }
  public removeItemByCartId(cartId: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(
      `${Api.API_URL} ${Api.METHODS.D_P_FROM_CART_BY_ID} / ${cartId}`
    );
  }
  public getCartItems(custId: number): Observable<AddToCart[]> {
    return this.http
      .get<ApiResponse<AddToCart[]>>(
        `${Api.API_URL}${Api.METHODS.GET_ALL_PRODUCT_BY_CUST_ID}?id=${custId}`
      )
      .pipe(
        map((r) => {
          if (r.result && r.data) {
            const totalQuantity = r.data.reduce(
              (total, item) => total + item.quantity,
              0
            );
            this.cartQuantitySubject.next(totalQuantity);
            return r.data;
          } else {
            this.cartQuantitySubject.next(0);
            return [];
          }
        }),
        catchError((err) => {
          this.cartQuantitySubject.next(0);
          return of([]);
        })
      );
  }
}
