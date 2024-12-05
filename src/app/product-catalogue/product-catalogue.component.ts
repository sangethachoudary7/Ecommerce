import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ToastrWrapperModule } from '../module/toastr-wrapper-module';
import { Login, User } from '../interface/login';
import { AddToCart } from '../interface/product';
import { Observable, Subscription } from 'rxjs';
import { CartComponent } from './cart/cart.component';
import { CartService } from '../service/cart.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
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
  isUpdateVisible = false;
  uDetails!: User;

  constructor(private cartService: CartService) {
    this.cartService.toggleCartVisibility();
    // this.cartService.toggleUpdateVisibility();
  }

  onUpdateVisibilityChange(isVisible: boolean): void {
    this.isUpdateVisible = isVisible;
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

// // constructor(private cartService: CartService) {
// //   this.cartService.cartVisible$.subscribe((isvisible) => {
// //     this.isCartVisible = isvisible;
// //     console.log('pc', this.isCartVisible);
// //   });
// //   this.cartService.toggleCartVisibility();
// //   this.cartService.toggleUpdateVisibility();
// // }

// // onUpdateVisibilityChange(isVisible: boolean): void {
// //   this.isUpdateVisible = isVisible;
// // }
// // OnCartVisibilityChange(isCVisible: boolean): void {
// //   this.isCartVisible = isCVisible;
// // }
// // onCategorySelected(categoryId: number) {
// //   this.selectedCategoryId = categoryId;
// // }
// // cartItems(cartItems$: Observable<AddToCart[]>) {
// //   this.cartItems$ = cartItems$;
// //   this.isCartVisible = true;
// //  this.isCartVisible= this.cartService.cartVisible$;
// // }
// // userDetails(uDetails: User) {
// //   this.uDetails = uDetails;
// // }
// // }
