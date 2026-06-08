import { Component, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../../services/cart';
import { WishlistService } from '../../../services/wish-list';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(
    public cartService: CartService,
    public wishlistService: WishlistService,
    private router: Router,
  ) {}

  getCartCount(): number {
    return this.cartService.cartCount();
  }

  getWishlistCount(): number {
    return this.wishlistService.wishlistCount();
  }

  isMenuOpen = signal(false);
  isScrolled = signal(false);

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  navigateToWishlist() {
    this.router.navigate(['/wishlist']);
  }
}
