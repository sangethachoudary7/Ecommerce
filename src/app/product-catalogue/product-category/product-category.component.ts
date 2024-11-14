import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductsService } from '../../service/products.service';
import { ProductCategory } from '../../interface/product';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css',
})
export class ProductCategoryComponent implements OnInit {
  public category$!: Observable<ProductCategory[]>;
  public selectedCategoryId: number | null = null;
  selectedSubCategoryId: number | null = null;
  public categories: ProductCategory[] = [];

  @Output() sCategoryId = new EventEmitter<number>();

  constructor(private proServ: ProductsService) {}
  ngOnInit() {
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

  toggleDropdown(categoryId: number): void {
    this.selectedCategoryId =
      this.selectedCategoryId === categoryId ? null : categoryId;
  }

  hasSubCategories(categoryId: number): boolean {
    return this.categories.some((sub) => sub.parentCategoryId === categoryId);
  }
  setSelectedSubCategory(subCategoryId: number): void {
    this.selectedSubCategoryId = subCategoryId;
  }
  public selectCategoryId(categoryId: number) {
    this.sCategoryId.emit(categoryId);
  }
}
