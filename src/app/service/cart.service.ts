import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError, throwError, Observable, BehaviorSubject } from 'rxjs';
import { Api, headers } from './constant/constant';
import { AddToCart, ApiResponse } from '../interface/product';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartQuantitySubject = new BehaviorSubject<number>(0);
  cartQuantity$ = this.cartQuantitySubject.asObservable();

  constructor(private http: HttpClient, private toastr: ToastrService) {}

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
          if (resp) {
            const currentQuantity = this.cartQuantitySubject.value;
            this.cartQuantitySubject.next(currentQuantity + cartData.quantity);
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
}
