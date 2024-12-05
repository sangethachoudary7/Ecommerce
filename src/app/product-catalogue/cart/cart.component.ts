import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CartService } from '../../service/cart.service';
import { CommonModule } from '@angular/common';
import {
  catchError,
  finalize,
  map,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { AddToCart, ApiResponse } from '../../interface/product';
import { ProductsService } from '../../service/products.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  @Input() cartItems!: Observable<AddToCart[]>;
  @Input() custId!: number;

  cartService = inject(CartService);
  proService = inject(ProductsService);
  toastr = inject(ToastrService);
  router = inject(Router);

  cartVisible$!: Observable<boolean>;
  ngOnInit(): void {
    // this.cartItems = this.cartService.cartItems$;
    if (!this.cartItems) {
      this.cartItems = this.cartService.cartItems$;
    }
  }
  incrementQuantity(product: AddToCart): any {
    // this.cartService.updateCartQuantity(productId, 1);
    product.quantity = product.quantity + 1;
    this.cartService
      .addToCart(product)
      .pipe(
        tap((resp) => {
          if (resp.message) {
            this.toastr.success(resp.message);
          }
        }),
        catchError((e) => {
          this.toastr.error(e);
          return throwError(() => e);
        })
      )
      .subscribe();
  }

  decrementQuantity(product: AddToCart) {
    product.quantity = product.quantity - 1;
  }

  removeItem(productId: number): void {
    this.cartService.removeCartItem(productId);
  }

  get totalPrice$() {
    return this.cartService.totalPrice$;
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
}
