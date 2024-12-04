import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product, ProductCategory } from '../interface/product';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../service/products.service';
import { catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../service/global.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent {
  productForm: FormGroup;
  categories: ProductCategory[] = [];
  // isSubmitting: boolean = false;
  public category$!: Observable<ProductCategory[]>;
  constructor(
    private fb: FormBuilder,
    private proServ: ProductsService,
    private toastr: ToastrService,
    private globalServ: GlobalService
  ) {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      productSku: ['', [Validators.required]],
      productShortName: ['', [Validators.required]],
      productPrice: [0, [Validators.required, Validators.min(1)]],
      productDescription: ['', [Validators.required, Validators.minLength(10)]],
      productCategory: ['', [Validators.required]],
      productImageUrl: ['', [Validators.required]],
      deliveryTimeSpan: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.fetchCategories();
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
  createProduct(): void {
    if (this.productForm.invalid) {
      this.toastr.warning('Please fill in all required fields correctly.');
      return;
    }

    const productData = this.productForm.value;
    console.log('product data', productData);
    const productToSend: Product = {
      ...productData,
      createdDate: new Date().toISOString(),
      categoryId: productData.productCategory.categoryId, // Ensure correct field mapping
      categoryName: productData.productCategory.categoryName,
    };
    console.log('product data', productToSend);
    this.globalServ.startLoading();

    this.proServ
      .addProduct(productToSend)
      .pipe(
        tap((resp) => {
          if (resp.result) {
            this.toastr.success(resp.message ?? 'Operation successful');
            this.productForm.reset();
          } else {
            this.toastr.warning(resp.message ?? 'Something went wrong');
          }
        }),

        finalize(() => {
          this.globalServ.stopLoading();
        })
      )
      .subscribe();
  }
}

// catchError((e) => {
//   // this.toastr.error('An error occurred while saving the product.');
//   return throwError(() => e);
// }),
// switchMap((resp) => {
//   if (resp && resp.message) {
//     this.toastr.success(resp.message);
//     this.productForm.reset();
//   }
//   return of(resp); // Return a new observable here if needed
// }),
