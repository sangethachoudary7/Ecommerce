import { Component, inject, Input, OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { AddToCart, Product } from '../../interface/product';
import { ProductsService } from '../../service/products.service';

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

  ngOnInit() {
    if (this.custId) {
      this.cartService.getCartItems(this.custId).subscribe();
    }
  }
  incrementQuantity(product: AddToCart): any {
    // this.cartService.updateCartQuantity(productId, 1);
    this.proService.updateProduct(product);
  }

  decrementQuantity(productId: number): void {
    this.cartService.updateCartQuantity(productId, -1);
  }

  removeItem(productId: number): void {
    this.cartService.removeCartItem(productId);
  }
  get cartItems$() {
    return this.cartService.cartItems$;
  }

  get totalPrice$() {
    return this.cartService.totalPrice$;
  }
}
