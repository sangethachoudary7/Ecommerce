import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest, map } from 'rxjs';
import { AddToCart } from '../../../../interface/product';
import { CartService } from '../../../../service/cart.service';
import { Comment } from '@angular/compiler';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent {
 cartItems$!: Observable<AddToCart[]>;
  totalProductPrice$!: Observable<number>;
  shippingPrice$!: Observable<number>;
  totalAmount$!: Observable<number>;

 
  constructor(private cartService: CartService, private router: Router) {}
  ngOnInit() {
    this.cartItems$ = this.cartService.cartItems$;
    this.totalProductPrice$ = this.cartService.totalPrice$;
    this.shippingPrice$ = this.cartService.ShippingPrice$;

    // Calculate the total amount (product price + shipping price)
    this.totalAmount$ = combineLatest([
      this.totalProductPrice$,
      this.shippingPrice$,
    ]).pipe(
      map(([productPrice, shippingPrice]) => productPrice + shippingPrice)
    );
  }
}
