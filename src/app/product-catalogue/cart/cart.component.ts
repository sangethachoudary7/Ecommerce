import { Component, inject, Input } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AddToCart } from '../../interface/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  @Input() cartItems!: Observable<AddToCart[]>;
}
