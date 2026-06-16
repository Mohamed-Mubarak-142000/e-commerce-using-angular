import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductActions } from '../product-actions/product-actions';
import { CartService } from '../../../services/cart';
import { WishlistService } from '../../../services/wish-list';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, ProductActions],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
})
export class ProductCard implements OnInit {
  quantity = signal(0);
  showToast = signal(false);
  toastMessage = signal('');
  constructor(
    private router: Router,
    public cartService: CartService,
    public wishlistService: WishlistService,
  ) {}

  ngOnInit() {
    // Initialize quantity from cart
    this.quantity.set(this.cartService.getQuantity(this.product?.id));
  }

  increaseQty() {
    const newQty = this.quantity() + 1;
    this.quantity.set(newQty);
    this.cartService.updateQuantity(this.product?.id, newQty);
  }

  decreaseQty() {
    const currentQty = this.quantity();
    if (currentQty > 1) {
      const newQty = currentQty - 1;
      this.quantity.set(newQty);
      this.cartService.updateQuantity(this.product?.id, newQty);
    } else if (currentQty === 1) {
      this.quantity.set(0);
      this.cartService.removeFromCart(this.product?.id);
    }
  }

  @Input() title: string = '';
  @Input() price: number = 0;
  @Input() oldPrice?: number;
  @Input() image: string = '';
  @Input() rating: number = 0;
  @Input() isLoading: boolean = false;
  @Input() discount?: number;
  @Input() description: string = '';
  @Input() product?: any;

  @Input() productId!: number;
  onViewDetails() {
    this.router.navigate(['/products', this.productId]);
  }

  @Output() addWishlist = new EventEmitter<void>();
  onAddWishlist() {
    this.addWishlist.emit();
    this.showToastMessage('Product added to wishlist!');
  }

  isInWishlist() {
    return this.wishlistService.wishlist().some((item) => item.id === this.productId);
  }

  @Output() addToCart = new EventEmitter<{ quantity: number }>();
  onAddToCart() {
    const qty = this.quantity() + 1;
    this.quantity.set(qty);
    // this.cartService.addToCart(this.product, 1);
    this.addToCart.emit({
      quantity: qty,
    });
    this.showToastMessage('Product added to cart!');
  }

  showToastMessage(message: string) {
    this.toastMessage.set(message);
    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }
}
