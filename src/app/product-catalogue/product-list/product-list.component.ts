import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  catchError,
  combineLatest,
  finalize,
  map,
  Observable,
  of,
  pipe,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import { ProductsService } from '../../service/products.service';
import { CommonModule } from '@angular/common';
import { AddToCart, ApiResponse, Product } from '../../interface/product';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { User } from '../../interface/login';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit, OnChanges {
  public prodList$!: Observable<Product[]>;
  public cartItems$!: Observable<AddToCart[]>;
  public selectedProductDetails$!: Observable<Product>;

  @Input() selectedCategoryId: number | null = null;
  @Output() cartItems = new EventEmitter<Observable<AddToCart[]>>();
  loading = false;

  userDetails!: User;

  @ViewChild('cartWindow') cartWindow!: ElementRef;
  isCartHidden = true;

  public selectedProduct!: Product | null;
  public quantity: number = 1;
  // cartQuantity$!: Observable<number>;
  cartService = inject(CartService);
  cartQuantity$ = this.cartService.cartQuantity$; // Bind cartQuantity$ directly from CartService

  constructor(
    private proService: ProductsService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.getUserDetails();
    this.loadProducts();
    if (this.userDetails && this.userDetails.custId) {
      // Fetch cart items and update quantity
      // this.cartItems$ = this.getCartItems1();
      this.cartItems$ = this.cartService.getCartItems(this.userDetails.custId);
      this.cartQuantity$ = this.cartItems$.pipe(
        map((items) => items.reduce((sum, item) => sum + item.quantity, 0))
      );
    }
  }

  getUserDetails() {
    const userDetailsString = sessionStorage.getItem('userDetails');
    if (userDetailsString) {
      this.userDetails = JSON.parse(userDetailsString);
    } else {
      this.userDetails = {} as User;
    }
  }
  private loadProducts() {
    this.loading = true;
    this.proService.startLoading(this.loading);

    if (this.selectedCategoryId !== null) {
      this.prodList$ = this.getProductsById(this.selectedCategoryId).pipe(
        shareReplay(1),
        tap((p) => {
          if (p.length === 0) {
            this.toastr.warning('No products found for the selected category');
          }
          this.loading = false;
          this.proService.startLoading(this.loading);
        }),
        catchError((e) => {
          this.loading = false;
          this.proService.startLoading(this.loading);
          return throwError(() => e);
        })
      );
    } else {
      this.prodList$ = this.proService.getProducts().pipe(
        map((resp) => {
          return resp.data;
        }),
        shareReplay(1),
        tap((p) => {
          if (p.length === 0) {
            this.toastr.warning('No products available!');
          }
          this.loading = false;
          this.proService.startLoading(this.loading);
        }),
        catchError((e) => {
          this.loading = false;
          this.proService.startLoading(this.loading);
          return throwError(() => {});
        })
      );
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['selectedCategoryId'] &&
      !changes['selectedCategoryId'].isFirstChange()
    ) {
      this.loadProducts();
    }
  }

  onCategorySelected(categoryId: number) {
    this.selectedCategoryId = categoryId;
  }

  getProductsById(categoryId: number): Observable<Product[]> {
    return this.proService.getProductsByCategoryId(categoryId).pipe(
      map((resp) => {
        return resp.data;
      }),
      catchError((e) => {
        this.toastr.success('API Error', 'Contact Admin');
        return of([]);
      })
    );
  }
  public getProductsByPId(id: Product) {
    return this.proService
      .getProductsById(id)
      .pipe(
        map((resp) => {
          console.log('pid', resp.data);
          return resp.data;
        }),
        catchError((e) => {
          this.toastr.success('API Error', 'Contact Admin');
          return of([]);
        })
      )
      .subscribe();
  }
  showProductDetails(product: Product) {
    this.selectedProduct = product;
    this.isCartHidden = false;
    // this.quantity = 1;
  }

  addToCart() {
    if (!this.selectedProduct || this.quantity <= 0) {
      this.toastr.warning('No products in cart');
      return null;
    }
    const cartData: AddToCart = {
      cartId: 0,
      custId: this.userDetails.custId,
      productId: this.selectedProduct.productId,
      quantity: this.quantity,
      addedDate: new Date().toDateString(),
    };
    this.loading = true;

    return this.cartService
      .addToCart(cartData)
      .pipe(
        tap((resp: ApiResponse<string>) => {
          if (resp && resp.message) {
            console.log('tap resp', resp);
            this.toastr.success(resp.message);
            this.closeCart();
          } else {
            this.toastr.warning('Failed to add item to cart.');
          }
        }),
        catchError((error) => {
          this.toastr.error('Error adding item to cart. Please try again.');
          return [];
          // return throwError(() => error);
        }),
        finalize(() => {
          this.loading = false;
          this.proService.startLoading(this.loading);
        })
      )
      .subscribe();
  }
  closeCart() {
    this.isCartHidden = true;
  }
  incrementQuantity() {
    this.quantity += 1;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  clearCart() {
    this.cartService.removeItemByCartId(this.userDetails.custId).pipe(
      map((resp) => {
        if (resp && resp.message) {
          this.decrementQuantity();
          this.toastr.success(resp.message);
        }
      }),
      catchError((e) => {
        this.toastr.error(e);
        return throwError(() => e);
      })
    );
    this.cartService.resetCart();
    this.toastr.info('Cart cleared!');
  }
  getCartItems() {
    if (this.cartQuantity$) {
      this.cartItems$ = this.cartService
        .getCartItems(this.userDetails.custId)
        .pipe(
          tap((resp) => {
            console.log('tap plist', resp);
            if (resp && resp.length > 0) {
              // this.cartService.toggleCartVisibility(); // Show cart if items exist
            } else {
              this.toastr.info('No Products Available in cart');
            }
          }),
          catchError((e) => {
            return of([]);
          })
        );
      this.cartItems.emit(this.cartItems$);
    } else {
      this.toastr.info('No Products Available in cart');
    }
  }
  getCartItems1(): Observable<AddToCart[]> {
    return this.cartService.getCartItems(this.userDetails.custId).pipe(
      tap((resp) => {
        console.log('Cart Items:', resp);
        if (resp && resp.length > 0) {
          // You can calculate the cart quantity here if needed
          const totalQuantity = resp.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          console.log('Total Cart Quantity:', totalQuantity);
        } else {
          this.toastr.info('No Products Available in cart');
        }
      }),
      catchError((e) => {
        this.toastr.error('Error fetching cart items');
        return of([]); // Return empty array on error
      })
    );
  }
}
