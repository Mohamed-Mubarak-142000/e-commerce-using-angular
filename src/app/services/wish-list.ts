import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../types/product';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private storageKey = 'wishlist';

  private wishlistSignal = signal<Product[]>(
    JSON.parse(localStorage.getItem(this.storageKey) || '[]'),
  );

  wishlist = this.wishlistSignal.asReadonly();

  wishlistCount = computed(() => {
    const wishlist = this.wishlistSignal();
    if (!Array.isArray(wishlist)) return 0;
    return wishlist.length;
  });

  toggle(product: Product) {
    const exists = this.wishlistSignal().some((p) => p.id === product.id);

    if (exists) {
      this.remove(product.id);
    } else {
      this.add(product);
    }
  }

  private add(product: Product) {
    this.wishlistSignal.update((list) => {
      const updated = [...list, product];
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      return updated;
    });
  }

  remove(id: number) {
    this.wishlistSignal.update((list) => {
      const updated = list.filter((p) => p.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      return updated;
    });
  }
}
