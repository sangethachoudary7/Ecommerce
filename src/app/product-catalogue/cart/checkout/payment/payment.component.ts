import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../../service/cart.service';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit {
  public amount!: Observable<number>;
  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef;
  constructor(private router: Router, private cartServ: CartService) {}

  ngOnInit() {
    // this.amount = this.TotalAmount$.pipe(
    //   map((r) => {
    //     r.toString();
    //   })
    // );

    window.paypal
      .Buttons({
        style: {
          layout: 'horizontal',
          color: 'blue',
          shape: 'rect',
          lable: 'paypal',
        },
        // createOrder: (data: any, actions: any) => {
        //   return this.TotalAmount$.pipe(
        //     map((totalAmount) => totalAmount.toFixed(2)), // Ensure numeric value is formatted as string
        //     map((formattedAmount) => {
        //       return actions.order.create({
        //         purchase_units: [
        //           {
        //             amount: {
        //               value: formattedAmount,
        //               currency_code: 'USD',
        //             },
        //           },
        //         ],
        //       });
        //     })
        //   ).toPromise();
        // },
        createOrder: async (data: any, actions: any) => {
          // Fetch the total amount using firstValueFrom
          const totalAmount = await firstValueFrom(this.TotalAmount$.pipe(
            map((amount) => amount.toFixed(2)) // Ensure numeric value is formatted as a string
          ));
    
          // Create the PayPal order
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: totalAmount, // Pass the formatted value as string
                  currency_code: 'USD',
                },
              },
            ],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            console.log(details);
            if (details.status === 'COMPLETED') {
              this.cartServ.transactionID = details.id;
              this.router.navigate(['catalogue/checkout/complete'])
            }
         })
        },
        onError: (error: any) => {
          console.log(error);
        }
      })
      .render(this.paymentRef.nativeElement);
  }
  get totalProductPrice$() {
    return this.cartServ.totalPrice$;
  }

  get shippingPrice$() {
    return this.cartServ.ShippingPrice$;
  }
  get TotalAmount$() {
    return combineLatest([this.totalProductPrice$, this.shippingPrice$]).pipe(
      map(([productPrice, shippingPrice]) => productPrice + shippingPrice)
    );
  }
  paymentCancle() {
    this.router.navigate(['catalogue/cart']);
  }
}
