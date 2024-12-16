import { Component, inject } from '@angular/core';
import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Product, ProductCategory } from '../interface/product';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../service/global.service';
import { ProductsService } from '../service/products.service';
import { CommonModule } from '@angular/common';

import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css',
})
export class CategoryManagementComponent {
  public categoryList$!: Observable<ProductCategory[]>;
  public paginatedProducts: Product[] = [];

  public proServ = inject(ProductsService);
  public toastr = inject(ToastrService);
  public globalServ = inject(GlobalService);
  public router = inject(Router);
  public catServ = inject(CategoryService);

  ngOnInit() {
    this.globalServ.startLoading();
    this.loadCategories();
  }
  loadCategories(): Observable<ProductCategory[]> {
    this.categoryList$ = this.proServ.getCategory().pipe(
      map((resp) => {
        return resp.data;
      }),
      shareReplay(1),
      tap((c) => {
        if (c.length === 0) {
          console.log('c', c);
          this.toastr.warning('No Category available!');
        }
        this.catServ.updateCategorySubject(c);
      }),
      catchError((e) => {
        this.toastr.error('An error occurred while fetching Category.');
        return throwError(() => e);
      }),
      finalize(() => {
        this.globalServ.stopLoading();
      })
    );

    return this.categoryList$;
  }

  updateCategory(category: ProductCategory) {
    this.toastr.info('No API available for Update,so Its still pending');
    // this.router.navigate(['/createCategory', category.categoryId]);
    // console.log('Edit Category:', category);
  }

  deleteCategory(cId: number) {
    // this.categoryList$ = this.catServ.deleteCategoryCId(cId).pipe(
    //   switchMap(() => this.catServ.getCategory()),
    //   map((resp) => resp.data),
    //   tap((resp) => {
    //     this.toastr.success('Category Deleted successfully!');
    //     return resp;
    //   }),
    //   catchError((error) => {
    //     this.toastr.error('Failed to delete category: ' + error);
    //     return of([]);
    //     // return throwError(() => error);
    //   }),
    //   catchError((error) => {
    //     this.toastr.error('Failed to load categories: ' + error);
    //     // Return the previously fetched category list if the delete fails
    //     return of([]); // You can return the previously fetched categories here
    //   })
    // );

    this.categoryList$ = this.catServ.getCategory().pipe(
      switchMap((initialCategories) => {
        return this.catServ.deleteCategoryCId(cId).pipe(
          switchMap(() => this.catServ.getCategory()),
          map((resp) => resp.data),
          tap(() => {
            this.toastr.success('Category Deleted successfully!');
          }),
          catchError((error) => {
            this.toastr.error('Failed to delete category: ' + error);

            return of(initialCategories.data);
          })
        );
      }),
      catchError((error) => {
        this.toastr.error('Failed to load categories: ' + error);
        return of([]);
      })
    );
    return this.categoryList$;
  }
  addCategory() {
    this.router.navigateByUrl('/createCategory');
  }
}
