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
import { CreateCatagoryComponent } from './create-catagory/create-catagory.component';

import { AboutComponent } from './welcome-page/about/about.component';
import { ContactComponent } from './welcome-page/contact/contact.component';

import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { HomePageComponent } from './welcome-page/home-page/home-page.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ServicepageComponent } from './welcome-page/servicepage/servicepage.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { CategoryManagementComponent } from './category-management/category-management.component';

export const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomePageComponent,
    children: [
      {
        path: 'home',
        component: HomePageComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'service',
        component: ServicepageComponent,
      },

      {
        path: 'contact',
        component: ContactComponent,
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  { path: '', redirectTo: 'product-management', pathMatch: 'full' },
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
    path: 'createCategory',
    component: CreateCatagoryComponent,
  },
  {
    path: 'product-management',
    component: ProductManagementComponent,
  },
  {
    path: 'category-management',
    component: CategoryManagementComponent,
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
  {
    path: '**',
    component: NotfoundComponent, // Wildcard route for 404
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)], // Use forRoot() for the root module
  exports: [RouterModule],
})
export class AppRoutingModule {}
