import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { ProductsService } from '../../service/products.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../interface/product';
import { ProductCategoryComponent } from '../product-category/product-category.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCategoryComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit, OnChanges {
  public prodList$!: Observable<Product[]>;
  constructor(private proService: ProductsService) {}

  @Input() selectedCategoryId: number | null = null;
  ngOnInit() {
    this.loadProducts();
  }
  private loadProducts() {
    console.log('load categories:', this.selectedCategoryId);
    if (this.selectedCategoryId !== null) {
      this.prodList$ = this.getProductsById(this.selectedCategoryId);
    } else {
      this.prodList$ = this.proService.getProducts().pipe(
        map((resp) => {
          console.log(resp.data);
          return resp.data;
        }),
        catchError((e) => {
          return throwError(() => {});
        })
      );
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('simple', changes);
    if (
      changes['selectedCategoryId'] &&
      !changes['selectedCategoryId'].isFirstChange()
    ) {
      this.loadProducts();
    }
  }

  onCategorySelected(categoryId: number) {
    console.log('input', categoryId);
    this.selectedCategoryId = categoryId;
  }
  getProductsById(categoryId: number): Observable<Product[]> {
    return this.proService.getProductsByCategoryId(categoryId).pipe(
      map((resp) => {
        console.log('getPRoduc', resp);
        return resp.data;
      }),
      catchError((e) => {
        console.error('Error fetching products by category:', e);
        return of([]);
      })
    );
  }
}
