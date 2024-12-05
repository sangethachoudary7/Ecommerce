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
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AddToCart } from '../../interface/product';
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
export class CartComponent {
  @Input() cartItems!: Observable<AddToCart[]>;
  @Input() custId!: number;

  cartService = inject(CartService);
  proService = inject(ProductsService);
  toastr = inject(ToastrService);
  router = inject(Router);

  cartVisible$!: Observable<boolean>;

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
}
