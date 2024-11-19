import { Component } from '@angular/core';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ToastrWrapperModule } from '../module/toastr-wrapper-module';
import { Login } from '../interface/login';

@Component({
  selector: 'app-product-catalogue',
  standalone: true,
  imports: [
    ProductListComponent,
    ProductCategoryComponent,
    ToastrWrapperModule,
  ],
  templateUrl: './product-catalogue.component.html',
  styleUrl: './product-catalogue.component.css',
})
export class ProductCatalogueComponent {
  selectedCategoryId: number | null = null;

  constructor() {}

  onCategorySelected(categoryId: number) {
    this.selectedCategoryId = categoryId;
  }
}
