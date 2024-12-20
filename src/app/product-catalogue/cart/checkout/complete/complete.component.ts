import { Component } from '@angular/core';
import { CartService } from '../../../../service/cart.service';

@Component({
  selector: 'app-complete',
  standalone: true,
  imports: [],
  templateUrl: './complete.component.html',
  styleUrl: './complete.component.css'
})
export class CompleteComponent {
  transactionId = "";
  constructor(private cartServ: CartService) { }
  
  ngOnInit(): void{
    this.transactionId = this.cartServ.transactionID;
  }
}
