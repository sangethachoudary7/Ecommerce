import { Component, } from '@angular/core';
import { CartService } from '../../../service/cart.service';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent  {


  currentStep = 0;
  constructor(private cartService: CartService, private router: Router) {}
 
  goNext() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
    switch (this.currentStep) {
      case 0:
        this.router.navigate(['catalogue/checkout/order-summary']);
        break;
      case 1:
        this.router.navigate(['catalogue/checkout/address']);
        break;
      case 2:
        this.router.navigate(['catalogue/checkout/payment']);
        break;
      case 3:
        this.router.navigate(['catalogue/checkout/complete']);
        break;
    }
  }

  goBack() {
    if (this.currentStep > 0) {
      this.currentStep--; 
    }
     switch (this.currentStep) {
      case 0:
        this.router.navigate(['catalogue/checkout/order-summary']);
        break;
      case 1:
        this.router.navigate(['catalogue/checkout/address']);
        break;
      case 2:
        this.router.navigate(['catalogue/checkout/payment']);
        break;
      case 3:
        this.router.navigate(['catalogue/checkout/complete']);
        break;
    }
  }
}
