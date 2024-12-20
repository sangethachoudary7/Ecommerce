import { Component, inject, Input, OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { CommonModule } from '@angular/common';
import {
  catchError,
  combineLatest,
  finalize,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { AddToCart, ApiResponse, Product } from '../../interface/product';
import { ProductsService } from '../../service/products.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterOutlet } from '@angular/router';
import { GlobalService } from '../../service/global.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  @Input() cartItems!: Observable<AddToCart[]>;
  @Input() custId!: number;

  public prodList$!: Observable<{ data: Product }>;

  cartService = inject(CartService);
  proService = inject(ProductsService);
  toastr = inject(ToastrService);
  router = inject(Router);
  globalServ = inject(GlobalService);

  cartVisible$!: Observable<boolean>;

  currentDate: string;
  expectedDeliveryDate: string;

  constructor() {
    this.currentDate = this.formatDate(new Date()); // Get current date and format it
    this.expectedDeliveryDate = this.calculateExpectedDeliveryDate(); // Calculate expected delivery date
  }

  ngOnInit(): void {
    if (!this.cartItems) {
      this.cartItems = this.cartService.cartItems$;
    }
  }
  updateQuantity(
    product: AddToCart,
    change: number
  ): Observable<ApiResponse<string>> {
    const originalQuantity = product.quantity;
    product.quantity += change;
    this.globalServ.startLoading();
    return this.cartService.addToCart(product).pipe(
      tap((resp) => {
        if (resp.message) {
          if (resp.result === false && resp.message) {
            this.toastr.warning(
              `Backend responded with success, but quantity wasn't updated in db because i am using open API its having update issue. (Expected: ${product.quantity}, Actual: ${originalQuantity})`
            );
            product.quantity = originalQuantity;
          } else {
            this.toastr.success('Product quantity updated successfully.');
          }
        } else {
          this.toastr.error('Failed to update product quantity.');
        }
      }),
      catchError((e) => {
        this.toastr.error(e);
        return throwError(() => e);
      }),
      finalize(() => {
        this.globalServ.stopLoading();
      })
    );
  }

  incrementQuantity(product: AddToCart) {
    return this.updateQuantity(product, 1).subscribe();
  }

  decrementQuantity(product: AddToCart) {
    return this.updateQuantity(product, -1).subscribe();
  }

  removeItem(productId: number): void {
    this.cartService.removeCartItem(productId);
  }

  get totalProductPrice$() {
    return this.cartService.totalPrice$;
  }

  get shippingPrice$() {
    return this.cartService.ShippingPrice$;
  }
  get TotalAmount$() {
    return combineLatest([this.totalProductPrice$, this.shippingPrice$]).pipe(
      map(([productPrice, shippingPrice]) => productPrice + shippingPrice)
    );
  }
  closeCart() {
    this.cartService.toggleCartVisibility();
  }
  deleteItem(cartId: number) {
    return this.cartService
      .deleteCartProductByCartId1(cartId)
      .pipe(
        tap((response) => {
          if (response.result) {
            this.toastr.success('Product removed from cart');
            this.cartItems = this.cartService.cartItems$;
          } else {
            this.toastr.error('Failed to remove product');
          }
        }),
        catchError((error) => {
          this.toastr.error('Error removing product');
          return throwError(() => error);
        })
      )
      .subscribe();
  }
  calculateExpectedDeliveryDate(): string {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 5);

    return this.formatDate(currentDate);
  }

  // Function to format date in "DD.MM.YYYY" format
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }
  proceedToCheckout() {
    // this.router.navigateByUrl('/catalogue/cart/checkout');
    this.router.navigateByUrl('/catalogue/cart/checkout');
  }
}
