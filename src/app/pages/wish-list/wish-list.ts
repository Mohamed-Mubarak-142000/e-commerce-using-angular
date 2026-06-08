import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { WishlistService } from '../../services/wish-list';
import { CartService } from '../../services/cart';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, ProductCard, EmptyStateComponent],
  templateUrl: './wish-list.html',
  styleUrl: './wish-list.css',
})
export class WishList {
  showToast = signal(false);
  toastMessage = signal('');

  constructor(
    public wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router,
  ) {}

  removeFromWishlist(productId: number) {
    this.wishlistService.remove(productId);
    this.showToastMessage('Removed from wishlist');
  }

  moveToCart(product: any) {
    this.cartService.addToCart(product);
    this.wishlistService.remove(product.id);
    this.showToastMessage('Moved to cart!');
  }

  navigateToProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  showToastMessage(message: string) {
    this.toastMessage.set(message);
    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }
}
