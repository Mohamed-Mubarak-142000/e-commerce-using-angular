import { Component, signal, HostListener, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../../services/cart';
import { WishlistService } from '../../../services/wish-list';
import { UserAuthService } from '../../../services/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  private userAuthService = inject(UserAuthService);

  cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  user = this.userAuthService.currentUser;

  isLoggedIn = computed(() => !!this.user());

  isMenuOpen = signal(false);
  isScrolled = signal(false);

  constructor() {}

  ngOnInit() {
    const token = localStorage.getItem('accessToken');

    if (token && !this.userAuthService.currentUser()) {
      this.userAuthService.loadUser();
    }
  }

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

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.userAuthService.logout();
    this.router.navigate(['/login']);
  }

  getCartCount() {
    return this.cartService.cartCount();
  }

  getWishlistCount() {
    return this.wishlistService.wishlistCount();
  }
}
