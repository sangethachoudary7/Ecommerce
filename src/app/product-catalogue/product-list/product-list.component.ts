import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  forkJoin,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { ProductsService } from '../../service/products.service';
import { CommonModule } from '@angular/common';
import { AddToCart, ApiResponse, Product } from '../../interface/product';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../interface/login';
import { CartService } from '../../service/cart.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../service/global.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit, OnChanges {
  public prodList$!: Observable<Product[]>;
  public cartItems$!: Observable<AddToCart[]>;
  public selectedProductDetails$!: Observable<Product>;
  public cartQuantity$!: Observable<number>;
  public loading$!: Observable<boolean>;

  @Input() selectedCategoryId: number | null = null;
  @Output() cartItems = new EventEmitter<Observable<AddToCart[]>>();
  @Output() uDetails = new EventEmitter<User>();
  // @Output() isUpdate = new EventEmitter<boolean>();
  // @Output() isCart = new EventEmitter<boolean>();
  userDetails!: User;

  @ViewChild('cartWindow') cartWindow!: ElementRef;
  isCartHidden = true;

  public selectedProduct!: Product | null;
  public quantity: number = 0;

  cartService = inject(CartService);
  private updateVisibleSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private proService: ProductsService,
    private toastr: ToastrService,
    private router: Router,
    private globalServ: GlobalService
  ) {
    this.loading$ = this.globalServ.loading$;
  }
  ngOnInit() {
    this.getUserDetails();
    this.loadProducts();
    if (this.userDetails && this.userDetails.custId) {
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
      this.uDetails.emit(this.userDetails);
    } else {
      this.userDetails = {} as User;
    }
  }
  private loadProducts(): Observable<Product[] | []> {
    this.globalServ.startLoading();
    if (this.selectedCategoryId !== null) {
      this.prodList$ = this.getProductsByCId(this.selectedCategoryId).pipe(
        shareReplay(1),
        tap((p) => {
          if (p.length === 0) {
            this.toastr.warning('No products found for the selected category');
          }
        }),
        catchError((e) => {
          return throwError(() => e);
        }),
        finalize(() => {
          this.globalServ.stopLoading();
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
        }),
        catchError((e) => {
          return throwError(() => {});
        }),
        finalize(() => {
          this.globalServ.stopLoading();
        })
      );
    }
    return this.prodList$;
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

  getProductsByCId(categoryId: number): Observable<Product[]> {
    this.globalServ.startLoading();
    return this.proService.getProductsByCategoryId(categoryId).pipe(
      map((resp) => {
        return resp.data;
      }),
      catchError((e) => {
        this.toastr.success('API Error', 'Contact Admin');
        return of([]);
      }),
      finalize(() => {
        this.globalServ.stopLoading();
      })
    );
  }

  showProductDetails(product: Product) {
    this.globalServ.startLoading();
    const isProductExist = this.cartService.getCartItem(product.productId);
    if (isProductExist) {
      this.quantity = isProductExist.quantity;
    }
    this.selectedProduct = product;
    this.isCartHidden = false;
    this.globalServ.stopLoading();
  }

  addToCart(): Observable<AddToCart[]> {
    this.globalServ.startLoading();
    if (!this.selectedProduct || this.quantity <= 0) {
      this.toastr.warning('Invalid product or quantity');
      this.globalServ.stopLoading();
      return of([]);
    }
    const existingCartItem = this.cartService.getCartItem(
      this.selectedProduct.productId
    );
    let cartData: AddToCart;

    if (existingCartItem) {
      cartData = {
        ...existingCartItem,
        quantity: this.quantity,
      };
      console.log('Cd', cartData);
    } else {
      cartData = {
        cartId: 0,
        custId: this.userDetails.custId,
        productId: this.selectedProduct.productId,
        quantity: this.quantity,
        addedDate: new Date().toDateString(),
      };
    }
    this.cartItems$ = this.cartService.addToCart(cartData).pipe(
      switchMap(() => this.cartService.getCartItems(this.userDetails.custId)),
      tap((items) => {
        this.cartQuantity$ = of(
          items.reduce((sum, item) => sum + item.quantity, 0)
        );
        this.toastr.success('Item added to cart successfully!');
        this.closeCart();
        this.quantity = 0;
        return of(items);
      }),
      catchError((error) => {
        this.toastr.error('Error occurred while adding item to cart.');
        return throwError(() => error);
      }),
      finalize(() => {
        this.globalServ.stopLoading();
      })
    );
    return this.cartItems$;
  }
  closeCart() {
    this.isCartHidden = true;
    this.quantity = 0;
  }
  incrementQuantity() {
    this.quantity += 1;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  getCartItems() {
    this.globalServ.startLoading();
    if (this.cartQuantity$) {
      this.cartItems$ = this.cartService
        .getCartItems(this.userDetails.custId)
        .pipe(
          tap((resp) => {
            console.log('tap plist', resp);
            if (resp && resp.length > 0) {
            } else {
              this.toastr.info('No Products Available in cart');
            }
          }),
          catchError((e) => {
            return of([]);
          }),
          finalize(() => {
            this.globalServ.stopLoading();
          })
        );
      this.cartItems.emit(this.cartItems$);
      this.cartService.showCart();
    } else {
      this.toastr.info('No Products Available in cart');
    }
  }
  updateProduct(productId: number): void {
    // this.updateVisibleSubject.next(true);
    // this.isUpdate.emit(this.updateVisibleSubject.getValue());

    this.router.navigate(['catalogue', 'edit-product', productId]);
    this.cartService.showUpdate();
  }
  clearCart(): Observable<AddToCart[]> {
    this.globalServ.startLoading();
    let successCount: number = 0;
    let failureCount: number = 0;
    let failedCartIds: string[] = [];

    this.cartItems$ = this.cartService.cartItems$.pipe(
      take(1),
      switchMap((items) => {
        if (items.length === 0) {
          this.toastr.info('No products in Cart to clear!');
          return of([]);
        }
        const deleteRequests = items.map((item) =>
          this.cartService.deleteCartProductByCartId(item.cartId).pipe(
            tap((resp) => {
              if (resp.result && resp.message) {
                successCount += 1;
              }
            }),
            catchError((e) => {
              failureCount += 1;
              failedCartIds.push(item.productName || 'Unknown Item');
              return throwError(() => e);
            })
          )
        );
        return forkJoin(deleteRequests); // Execute all delete requests concurrently
      }),
      switchMap(() => {
        this.cartItems$ = this.cartService.getCartItems(
          this.userDetails.custId
        );
        this.cartQuantity$ = this.cartItems$.pipe(
          map((items) => items.reduce((sum, item) => sum + item.quantity, 0))
        );
        return this.cartItems$; // Return the refreshed cart items
      }),
      finalize(() => {
        if (successCount > 0 && failureCount === 0) {
          this.toastr.success('Cart Cleared');
        }
        if (successCount > 0 && failureCount > 0) {
          this.toastr.success('Some items were cleared successfully.');
          this.toastr.error(
            `Failed to clear items: ${failedCartIds.join(', ')}`
          );
        } else if (failureCount > 0) {
          this.toastr.error('Failed to clear the cart.');
        }

        this.globalServ.stopLoading();
      })
    );
    return this.cartItems$;
  }

  // public getProductsByPId(id: number) {
  //   this.globalServ.startLoading();
  //   return this.proService
  //     .getProductsById(id)
  //     .pipe(
  //       map((resp) => {
  //         console.log('pid', resp.data);
  //         return resp.data;
  //       }),
  //       catchError((e) => {
  //         this.toastr.success('API Error', 'Contact Admin');
  //         return of([]);
  //       }),
  //       finalize(() => {
  //         this.globalServ.startLoading();
  //       })
  //     )
  //     .subscribe();
  // }
}
