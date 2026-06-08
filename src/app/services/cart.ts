import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../types/product';
import { CartItem } from '../types/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private storageKey = 'cart';

  // load initial state from localStorage
  private cartSignal = signal<CartItem[]>(
    JSON.parse(localStorage.getItem(this.storageKey) || '[]'),
  );

  // READ ONLY public signal
  cart = this.cartSignal.asReadonly();

  // computed values
  cartCount = computed(() => {
    const cart = this.cartSignal();
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  });

  cartTotal = computed(() => {
    const cart = this.cartSignal();
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((sum, item) => {
      const price = item?.product?.price || 0;
      const discount = item?.product?.discountPercentage || 0;
      const discountedPrice = price * (1 - discount / 100);
      return sum + discountedPrice * (item?.quantity || 0);
    }, 0);
  });

  // Check if product exists in cart
  isInCart(productId: number) {
    return this.cartSignal().some((item) => item.product?.id === productId);
  }

  // Get cart item by product id
  getCartItem(productId: number) {
    return this.cartSignal().find((item) => item.product?.id === productId);
  }

  // Get quantity of product in cart
  getQuantity(productId: number) {
    const item = this.getCartItem(productId);
    return item?.quantity || 0;
  }

  addToCart(product: Product, quantity: number = 1) {
    if (!product?.id) return; // Guard against undefined product
    const existingItem = this.cartSignal().find((item) => item.product?.id === product.id);

    if (existingItem) {
      // If product exists, increment quantity
      this.cartSignal.update((cart) => {
        const updated = cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
        localStorage.setItem(this.storageKey, JSON.stringify(updated));
        return updated;
      });
    } else {
      // Add new product to cart
      this.cartSignal.update((cart) => {
        const updated = [...cart, { product, quantity }];
        localStorage.setItem(this.storageKey, JSON.stringify(updated));
        return updated;
      });
    }
  }

  removeFromCart(id: number) {
    this.cartSignal.update((cart) => {
      const updated = cart.filter((item) => item.product.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      return updated;
    });
  }

  updateQuantity(id: number, quantity: number) {
    this.cartSignal.update((cart) => {
      const updated = cart.map((item) =>
        item.product.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      );
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      return updated;
    });
  }

  clearCart() {
    this.cartSignal.set([]);
    localStorage.removeItem(this.storageKey);
  }
}
