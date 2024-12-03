import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  input,
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
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-updateproduct',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './updateproduct.component.html',
  styleUrl: './updateproduct.component.css',
})
export class UpdateproductComponent {
  productForm: FormGroup;
  categories: ProductCategory[] = [];
  isSubmitting: boolean = false;
  public category$!: Observable<ProductCategory[]>;
  public product$!: Observable<Product>;
  productId!: number;
  private desRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private proServ: ProductsService,
    private toastr: ToastrService,
    private actRrouter: ActivatedRoute,
    private router: Router,
    private cartService: CartService
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
    this.product$ = this.proServ.getProductsById(this.productId).pipe(
      map((resp) => {
        return resp.data;
      }),
      tap((product) => {
        if (product) {
          this.category$.pipe(take(1)).subscribe((categories) => {
            console.log('Categories:', categories);
            const matchingCategory = categories.find(
              (c) => c.categoryId === product.categoryId
            );
            console.log('Matching category:', matchingCategory);
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
          console.log('form values', this.productForm.value.productCategory);
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
    this.isSubmitting = true;
    this.proServ
      .updateProduct(productToSend)
      .pipe(
        map((resp) => {
          return resp;
        }),
        tap((resp) => {
          console.log('up responce', resp);
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
          this.isSubmitting = false;
          this.proServ.startLoading(this.isSubmitting);
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
