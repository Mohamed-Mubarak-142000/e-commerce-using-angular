import { ToastService } from './../../services/toast-service';
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart';
import { QuantitySelectorComponent } from '../../shared/components/quantity-selector/quantity-selector';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { Toast } from '../../shared/components/toast/toast';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    QuantitySelectorComponent,
    EmptyStateComponent,
    Toast,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  constructor(
    public cartService: CartService,
    public toastService: ToastService,
    public router: Router,
  ) {}

  getItemSubtotal(price: number, discount: number, quantity: number): number {
    const discountedPrice = price * (1 - discount / 100);
    return discountedPrice * quantity;
  }

  cartEmpty = computed(() => {
    // this.toastService.show('Your cart is empty!');
    return this.cartService.cart().length === 0;
  });

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
    this.toastService.show('Product removed from cart!');
  }

  increaseQuantity(productId: number) {
    const item = this.cartService.getCartItem(productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
      this.toastService.show('Quantity increased by 1');
    }
  }

  decreaseQuantity(productId: number) {
    const item = this.cartService.getCartItem(productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
      this.toastService.show('Quantity decreased by 1');
    }
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
