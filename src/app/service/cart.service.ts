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
  switchMap,
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
  private cartItemsSubject = new BehaviorSubject<AddToCart[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  private cartVisibleSubject = new BehaviorSubject<boolean>(false);
  cartVisible$ = this.cartVisibleSubject.asObservable();

  private updateVisibleSubject = new BehaviorSubject<boolean>(false);
  updateVisible$ = this.updateVisibleSubject.asObservable();

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  totalPrice$ = this.cartItems$.pipe(
    map((items) =>
      items.reduce(
        (sum, item) => sum + (item.productPrice || 0) * item.quantity,
        0
      )
    )
  );

  toggleCartVisibility() {
    const currentState = this.cartVisibleSubject.value;
    this.cartVisibleSubject.next(!currentState);
  }
  toggleUpdateVisibility() {
    const currentState = this.updateVisibleSubject.value;
    this.updateVisibleSubject.next(!currentState);
  }
  showCart() {
    this.cartVisibleSubject.next(true);
  }

  hideCart() {
    this.cartVisibleSubject.next(false);
  }
  showUpdate() {
    this.updateVisibleSubject.next(true);
  }

  hideUpdate() {
    this.updateVisibleSubject.next(false);
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
        catchError((e) => {
          this.toastr.error('API request failed:', e); // Log any error
          return throwError(() => e);
        })
      );
  }

  public resetCart() {
    this.cartQuantitySubject.next(0);
  }
  public getCartItems(custId: number): Observable<AddToCart[]> {
    return this.http
      .get<ApiResponse<AddToCart[]>>(
        `${Api.API_URL}${Api.METHODS.GET_ALL_PRODUCT_BY_CUST_ID}?id=${custId}`
      )
      .pipe(
        map((resp) => resp.data || []),
        tap((items) => {
          this.cartItemsSubject.next(items);
          const totalQuantity = items.reduce(
            (total, item) => total + item.quantity,
            0
          );
          this.cartQuantitySubject.next(totalQuantity);
        }),
        catchError((err) => {
          this.cartItemsSubject.next([]);
          this.cartQuantitySubject.next(0);
          return of([]);
        })
      );
  }

  isProductInCart(productId: number): boolean {
    const currentCart = this.cartItemsSubject.value; // Assuming cartItemsSubject holds the current cart state
    return currentCart.some((item) => item.productId === productId);
  }
  getCartItem(productId: number): AddToCart | null {
    const currentCart = this.cartItemsSubject.value;
    return currentCart.find((item) => item.productId === productId) || null;
  }
  updateCartQuantity(productId: number, qty: number): void {
    const updatedCart = this.cartItemsSubject.value.map((item) => {
      if (item.productId === productId) {
        const updatedQuantity = Math.max(1, item.quantity + qty); // Prevent quantity < 1
        return { ...item, quantity: updatedQuantity };
      }
      return item;
    });
    this.cartItemsSubject.next(updatedCart);
  }
  removeCartItem(productId: number): void {
    const updatedCart = this.cartItemsSubject.value.filter(
      (item) => item.productId !== productId
    );
    this.cartItemsSubject.next(updatedCart);
  }
  deleteCartProductByCartId(cartId: number): Observable<ApiResponse<string>> {
    return this.http
      .get<ApiResponse<string>>(
        `${Api.API_URL}${Api.METHODS.D_P_FROM_CART_BY_CART_ID}?id=${cartId}`
      )
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        })
      );
  }
  deleteCartProductByCartId1(cartId: number): Observable<ApiResponse<string>> {
    return this.http
      .get<ApiResponse<string>>(
        `${Api.API_URL}${Api.METHODS.D_P_FROM_CART_BY_CART_ID}?id=${cartId}`
      )
      .pipe(
        switchMap((response) => {
          console.log('Delete Response:', response);
          if (response.result) {
            const updatedCartItems = this.cartItemsSubject.value.filter(
              (item) => item.cartId !== cartId
            );
            this.cartItemsSubject.next(updatedCartItems);

            const updatedCartQuantity = updatedCartItems.reduce(
              (sum, item) => sum + item.quantity,
              0
            );
            this.cartQuantitySubject.next(updatedCartQuantity);
          }
          return of(response);
        }),
        catchError((err) => {
          console.error('Error Deleting Cart Product:', err);
          return throwError(() => err);
        })
      );
  }
}
