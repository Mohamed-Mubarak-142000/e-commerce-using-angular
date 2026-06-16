import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { WishlistService } from '../../services/wish-list';
import { CartService } from '../../services/cart';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { ToastService } from '../../services/toast-service';
import { Toast } from '../../shared/components/toast/toast';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, Toast, ProductCard, EmptyStateComponent],
  templateUrl: './wish-list.html',
  styleUrl: './wish-list.css',
})
export class WishList {
  constructor(
    public wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  removeFromWishlist(productId: number) {
    this.wishlistService.remove(productId);
    this.toastService.show('Removed from wishlist');
  }

  moveToCart(product: any) {
    this.cartService.addToCart(product);
    this.wishlistService.remove(product.id);
    this.toastService.show('Moved to cart!');
  }

  navigateToProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }
}
