import { Component, ViewChild } from '@angular/core';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ToastrWrapperModule } from '../module/toastr-wrapper-module';
import { Login, User } from '../interface/login';
import { AddToCart } from '../interface/product';
import { Observable } from 'rxjs';
import { CartComponent } from './cart/cart.component';
import { CartService } from '../service/cart.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UpdateproductComponent } from './updateproduct/updateproduct.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsService } from '../service/products.service';

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
  isCartVisible = false;
  isUpdateVisible = false;
  uDetails!: User;

  constructor(
    private cartService: CartService,
    private proServ: ProductsService
  ) {
    this.cartService.cartVisible$.subscribe((isvisible) => {
      this.isCartVisible = isvisible;
      console.log('pc', this.isCartVisible);
    });
  }
  onUpdateVisibilityChange(isVisible: boolean): void {
    this.isUpdateVisible = isVisible;
    if (isVisible) {
      this.isCartVisible = false; // Hide cart
    }
  }
  onCategorySelected(categoryId: number) {
    this.selectedCategoryId = categoryId;
  }
  cartItems(cartItems$: Observable<AddToCart[]>) {
    this.cartItems$ = cartItems$;
    this.isCartVisible = true;
    console.log('PCAtalog', this.cartItems$);
  }
  userDetails(uDetails: User) {
    this.uDetails = uDetails;
  }
}
