import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductCategory } from '../interface/product';
import { catchError, map, Observable, take, tap, throwError } from 'rxjs';
import { ProductsService } from '../service/products.service';
import { CartService } from '../service/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-catagory',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-catagory.component.html',
  styleUrl: './create-catagory.component.css',
})
export class CreateCatagoryComponent {
  public category$!: Observable<ProductCategory[]>;
  public isSubCategory = false;
  public pId: number = 0;

  public categoryForm!: FormGroup;

  // public selectedCategoryType: string = 'select';
  // public selectedParentCategory: string = 'select';
  // public parentCategoryName: string = '';
  constructor(
    private proServ: ProductsService,
    private toastr: ToastrService,
    private carts: CartService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      categoryType: ['select', Validators.required],
      parentCategory: ['select', Validators.required],
      categoryName: ['', Validators.required],
    });
  }
  ngOnInit() {
    // this.loadCategories();
  }

  private loadCategories(pId: number) {
    this.category$ = this.proServ.getCategory().pipe(
      map((resp) => {
        const categories = resp.data;
        console.log('data', resp.data);
        return categories.filter((c) =>
          pId === 0 ? c.parentCategoryId === 0 : c.parentCategoryId !== 0
        );
      }),
      catchError((e) => {
        return throwError(() => e);
      })
    );
    return this.category$;
  }
  onCategoryTypeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    if (value === 'sub') {
      this.isSubCategory = true;
      this.pId = 0;
    } else {
      this.isSubCategory = false;
      this.pId = -1;
    }
    this.loadCategories(this.pId);
  }

  addCategory() {
    if (this.categoryForm.invalid) {
      this.toastr.warning('Invalid Form');
      return;
    }
    const formData = this.categoryForm.value;
    this.proServ
      .createCategory(formData)
      .pipe(
        tap((resp) => {
          if (resp.result) {
            this.toastr.success(resp.message || '');
          } else {
            this.toastr.error(resp.message || '');
          }
        }),
        catchError((e) => {
          this.toastr.error(e);
          return throwError(() => e);
        })
      )
      .subscribe();
    this.loadCategories(this.pId);
    this.categoryForm.reset({
      categoryType: 'select',
      parentCategory: 'select',
      categoryName: '',
    });
  }
}
