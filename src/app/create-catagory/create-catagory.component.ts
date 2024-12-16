import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';
import { User } from '../interface/login';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-create-catagory',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-catagory.component.html',
  styleUrl: './create-catagory.component.css',
})
export class CreateCatagoryComponent implements OnInit {
  public category$!: Observable<ProductCategory[]>;
  public isSubCategory = false;
  public pId: number = 0;

  public categoryForm!: FormGroup;
  public userDetails!: User;
  constructor(
    private catServ: CategoryService,
    public proServ: ProductsService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      categoryType: ['select', Validators.required],
      parentCategory: ['select', Validators.required],
      categoryName: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    const userDetailsString = sessionStorage.getItem('userDetails');
    if (userDetailsString) {
      this.userDetails = JSON.parse(userDetailsString);
    } else {
      this.userDetails = {} as User;
    }
  }
  private loadCategories(pId: number) {
    this.category$ = this.proServ.getCategory().pipe(
      map((resp) => {
        const categories = resp.data;
        this.catServ.updateCategorySubject(resp.data);
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
  onSelectedCategory(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    if (value) {
    }
  }
  addCategory() {
    if (this.categoryForm.invalid) {
      this.toastr.warning('Invalid Form');
      return;
    }
    const formData: ProductCategory = this.categoryForm.value;
    formData.userId = this.userDetails.custId;

    this.catServ
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
    // this.loadCategories(this.pId);
    this.categoryForm.reset({
      categoryType: 'select',
      parentCategory: 'select',
      categoryName: '',
    });
    this.router.navigateByUrl('/category-management');
  }
  public getCategoryParentId() {}
}
