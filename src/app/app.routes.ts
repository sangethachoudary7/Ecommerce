import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './login/login.component';
import { ProductCatalogueComponent } from './product-catalogue/product-catalogue.component';
import { ProductDetailsComponent } from './product-catalogue/product-details/product-details.component';
import { RegisterComponent } from './register/register.component';
import { ProductCategoryComponent } from './product-catalogue/product-category/product-category.component';
import { ProductListComponent } from './product-catalogue/product-list/product-list.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { UpdateproductComponent } from './product-catalogue/updateproduct/updateproduct.component';
import { NgModule } from '@angular/core';
import { CartComponent } from './product-catalogue/cart/cart.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: AuthenticationComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'createproduct',
    component: CreateProductComponent,
  },
  {
    path: 'catalogue',
    component: ProductCatalogueComponent,
    children: [
      {
        path: 'a',
        component: ProductCatalogueComponent,
      },
      {
        path: 'category',
        component: ProductDetailsComponent,
      },
      {
        path: 'product',
        component: ProductListComponent,
      },
      {
        path: 'edit-product/:id',
        component: UpdateproductComponent,
      },
      {
        path: 'product/:productId',
        component: ProductDetailsComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)], // Use forRoot() for the root module
  exports: [RouterModule],
})
export class AppRoutingModule {}
