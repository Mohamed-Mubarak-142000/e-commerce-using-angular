import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart';
import { QuantitySelectorComponent } from '../../shared/components/quantity-selector/quantity-selector';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    QuantitySelectorComponent,
    EmptyStateComponent,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  constructor(public cartService: CartService) {}

  getItemSubtotal(price: number, discount: number, quantity: number): number {
    const discountedPrice = price * (1 - discount / 100);
    return discountedPrice * quantity;
  }

  cartEmpty = computed(() => {
    return this.cartService.cart().length === 0;
  });

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  increaseQuantity(productId: number) {
    const item = this.cartService.getCartItem(productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: number) {
    const item = this.cartService.getCartItem(productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }
}
