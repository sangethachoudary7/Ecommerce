import { Component, OnInit } from '@angular/core';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductListComponent } from './product-list/product-list.component';

@Component({
  selector: 'app-product-catalogue',
  standalone: true,
  imports: [ProductCategoryComponent, ProductListComponent],
  templateUrl: './product-catalogue.component.html',
  styleUrl: './product-catalogue.component.css',
})
export class ProductCatalogueComponent {}
