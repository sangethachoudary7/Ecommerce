import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  Observable,
  map,
  catchError,
  throwError,
  tap,
  finalize,
  take,
} from 'rxjs';
import { ProductCategory, Product } from '../../interface/product';
import { ProductsService } from '../../service/products.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { GlobalService } from '../../service/global.service';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-updateproduct',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './updateproduct.component.html',
  styleUrl: './updateproduct.component.css',
})
export class UpdateproductComponent implements OnDestroy {
  productForm: FormGroup;
  categories: ProductCategory[] = [];
  isSubmitting: boolean = false;
  public category$!: Observable<ProductCategory[]>;
  public product$!: Observable<Product>;
  productId!: number;

  constructor(
    private fb: FormBuilder,
    private proServ: ProductsService,
    private cartService: CartService,
    private toastr: ToastrService,
    private actRrouter: ActivatedRoute,
    private router: Router,
    private globalServ: GlobalService
  ) {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      productSku: [{ value: '', disabled: true }, [Validators.required]],
      productShortName: ['', [Validators.required]],
      productPrice: [0, [Validators.required, Validators.min(1)]],
      productDescription: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(10)],
      ],
      productCategory: ['', [Validators.required]],
      productImageUrl: ['', [Validators.required]],
      deliveryTimeSpan: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.productId = +this.actRrouter.snapshot.paramMap.get('id')!;
    console.log('second Pid', this.productId);

    this.fetchCategories();
    this.product$ = this.proServ.getProductsByProId(this.productId).pipe(
      map((resp) => {
        return resp.data;
      }),
      tap((product) => {
        if (product) {
          this.category$.pipe(take(1)).subscribe((categories) => {
            const matchingCategory = categories.find(
              (c) => c.categoryId === product.categoryId
            );
            if (matchingCategory) {
              this.productForm.patchValue({
                productName: product.productName,
                productSku: product.productSku,
                productShortName: product.productShortName,
                productPrice: product.productPrice,
                productDescription: product.productDescription,
                createdDate: new Date().toISOString(),
                productCategory: matchingCategory,
                productImageUrl: product.productImageUrl,
                deliveryTimeSpan: product.deliveryTimeSpan,
              });
            }
          });
        } else {
          this.toastr.warning('Product not found!');
        }
      }),
      catchError((e) => {
        this.toastr.error('Api Error');
        return throwError(() => e);
      })
    );
  }
  ngOnDestroy() {
    this.cartService.hideUpdate(); // Reset visibility when leaving the update component
  }
  fetchCategories() {
    this.category$ = this.proServ.getCategory().pipe(
      map((resp) => {
        this.categories = resp.data;
        return resp.data;
      }),
      catchError((e) => {
        return throwError(() => e);
      })
    );
  }
  updateProduct(): void {
    this.globalServ.startLoading();
    if (this.productForm.invalid) {
      this.toastr.warning('Please fill in all required fields correctly.');
      return;
    }
    const productData = this.productForm.getRawValue();
    const productToSend: Product = {
      productId: this.productId,
      productSku: productData.productSku,
      productName: productData.productName,
      productPrice: productData.productPrice,
      productShortName: productData.productShortName,
      productDescription: productData.productDescription,
      createdDate: productData.createdDate,
      deliveryTimeSpan: productData.deliveryTimeSpan,
      categoryId: productData.productCategory.categoryId,
      productImageUrl: productData.productImageUrl,
    };
    console.log('product to send data', productToSend);

    this.proServ
      .updateProduct(productToSend)
      .pipe(
        map((resp) => {
          return resp;
        }),
        tap((resp) => {
          if (resp.result) {
            this.toastr.success(resp.message ?? 'Operation successful');
            this.productForm.reset();
            this.updateProductList();
          } else {
            this.toastr.warning(resp.message ?? 'Something went wrong');
          }
        }),
        catchError((e) => {
          return throwError(() => e);
        }),
        finalize(() => {
          this.globalServ.stopLoading();
        })
      )
      .subscribe();
  }

  compareCategories(
    category1: ProductCategory,
    category2: ProductCategory
  ): boolean {
    return category1 && category2
      ? category1.categoryId === category2.categoryId
      : false;
  }
  updateProductList() {
    this.router.navigate(['/catalogue']);
  }
}
