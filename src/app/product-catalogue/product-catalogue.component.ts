import { Component } from '@angular/core';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ToastrWrapperModule } from '../module/toastr-wrapper-module';
import { User } from '../interface/login';
import { AddToCart } from '../interface/product';
import { combineLatest, map, Observable } from 'rxjs';
import { CartComponent } from './cart/cart.component';
import { CartService } from '../service/cart.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-product-catalogue',
  standalone: true,
  imports: [
    ProductListComponent,
    ProductCategoryComponent,
    ToastrWrapperModule,
    CartComponent,
    CommonModule,
    RouterOutlet,
  ],
  templateUrl: './product-catalogue.component.html',
  styleUrl: './product-catalogue.component.css',
})
export class ProductCatalogueComponent {
  selectedCategoryId: number | null = null;
  cartItems$!: Observable<AddToCart[]>;
  isCartVisible$!: Observable<boolean>;
  isUpdateVisible$!: Observable<boolean>;
  isAnyOverlayVisible$!: Observable<boolean>;
  uDetails!: User;

  constructor(private cartService: CartService) {
    this.isCartVisible$ = this.cartService.cartVisible$;
    this.isUpdateVisible$ = this.cartService.updateVisible$;
    this.isAnyOverlayVisible$ = combineLatest([
      this.isCartVisible$,
      this.isUpdateVisible$,
    ]).pipe(
      map(([cartVisible, updateVisible]) => cartVisible || updateVisible)
    );
  }

  onCategorySelected(categoryId: number) {
    this.selectedCategoryId = categoryId;
  }
  cartItems(cartItems$: Observable<AddToCart[]>) {
    this.cartItems$ = cartItems$;
    this.isCartVisible$ = this.cartService.cartVisible$;
  }

  userDetails(uDetails: User) {
    this.uDetails = uDetails;
  }
}
