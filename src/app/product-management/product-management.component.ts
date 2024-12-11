import { Component, inject, OnInit } from '@angular/core';
import {
  catchError,
  finalize,
  map,
  Observable,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import { Product } from '../interface/product';
import { ProductsService } from '../service/products.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../service/global.service';
import { Router } from '@angular/router';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css',
})
export class ProductManagementComponent implements OnInit {
  public prodList$!: Observable<Product[]>;
  public paginatedProducts: Product[] = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;
  public pageNumbers: number[] = [];
  public proServ = inject(ProductsService);
  public toastr = inject(ToastrService);
  public globalServ = inject(GlobalService);
  public router = inject(Router);

  constructor(private cartService: CartService) {}

  ngOnInit(): Observable<Product[]> {
    this.globalServ.startLoading();
    this.prodList$ = this.proServ.getProducts().pipe(
      map((resp) => {
        return resp.data;
      }),
      shareReplay(1),
      tap((p) => {
        if (p.length === 0) {
          this.toastr.warning('No products available!');
        }
        this.totalPages = Math.ceil(p.length / this.itemsPerPage);
        this.pageNumbers = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
        this.paginateProducts(p);
      }),
      catchError((e) => {
        this.toastr.error('An error occurred while fetching products.');
        return throwError(() => {});
      }),
      finalize(() => {
        this.globalServ.stopLoading();
      })
    );

    return this.prodList$;
  }
  paginateProducts(products: Product[]): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = products.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.prodList$.subscribe((products) => {
        this.paginateProducts(products);
      });
    }
  }

  editProduct(product: any) {
    this.router.navigate(['catalogue', 'edit-product', product.productId]);
    this.cartService.showUpdate();
    console.log('Edit product:', product);
  }

  deleteProduct(productId: number) {
    // this.prodList$= this.prodList$.filter((p) => p.id !== productId);
    this.proServ.deleteProductByPid(productId).pipe(
      map((resp) => {
        
      })
    )
    console.log('Deleted product with ID:', productId);
  }
  addProduct() {
    this.router.navigateByUrl('/createproduct');
  }
}
