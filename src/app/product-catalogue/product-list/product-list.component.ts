import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { ProductsService } from '../../service/products.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../interface/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  public prodList$!: Observable<Product[]>;
  constructor(private proService: ProductsService) {}

  ngOnInit() {
    console.log('ProductDetailsComponent loaded');
    this.prodList$ = this.proService.getProducts().pipe(
      map((resp) => {
        console.log('switchmap', resp);
        return resp.data;
      }),
      catchError((e) => {
        console.log('pError', e);
        return throwError(() => {});
      })
    );
  }
}
