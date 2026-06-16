import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Product, ProductResponse } from '../../types/product';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wish-list';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { ReviewsComponent } from '../../shared/components/reviews/reviews';
import { QuantitySelectorComponent } from '../../shared/components/quantity-selector/quantity-selector';
import { ToastService } from '../../services/toast-service';
import { Toast } from '../../shared/components/toast/toast';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    Toast,
    ProductCard,
    ReviewsComponent,
    QuantitySelectorComponent,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  loading = signal(true);
  selectedImageIndex = signal(0);
  quantity = signal(1);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public cartService: CartService,
    public wishlistService: WishlistService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: number) {
    this.loading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.quantity.set(1);
        this.selectedImageIndex.set(0);
        this.loadRelatedProducts(product.category);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/products']);
      },
    });
  }

  loadRelatedProducts(category: string) {
    this.productService.getProductsByCategory(category).subscribe({
      next: (response: ProductResponse) => {
        this.relatedProducts.set(
          response.products.filter((p) => p.id !== this.product()?.id).slice(0, 4),
        );
      },
    });
  }

  discountedPrice = computed(() => {
    const prod = this.product();
    if (!prod) return 0;
    return prod.price * (1 - prod.discountPercentage / 100);
  });

  getRatingArray = (rating: number): number[] => {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  };

  selectImage(index: number) {
    this.selectedImageIndex.set(index);
  }

  increaseQty() {
    this.quantity.update((q) => q + 1);
    this.toastService.show('Quantity increased by 1');
  }

  decreaseQty() {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
      this.toastService.show('Quantity decreased by 1');
    }
  }

  addToCart() {
    const prod = this.product();
    if (prod) {
      this.cartService.addToCart(prod, this.quantity());
      this.toastService.show('Added to cart!');
    }
  }

  toggleWishlist() {
    const prod = this.product();
    if (prod) {
      this.wishlistService.toggle(prod);
      const inWishlist = this.wishlistService.wishlist().some((p) => p.id === prod.id);
      this.toastService.show(inWishlist ? 'Added to wishlist!' : 'Removed from wishlist!');
    }
  }

  isInWishlist = computed(() => {
    const prod = this.product();
    if (!prod) return false;
    return this.wishlistService.wishlist().some((p) => p.id === prod.id);
  });

  navigateToProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }
}
