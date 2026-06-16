import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wish-list';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category-service';
import { Product } from '../../types/product';
import { MatIconModule } from '@angular/material/icon';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { ProductCardSkeleton } from '../../shared/components/product-card-skeleton/product-card-skeleton';
@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatCardModule,
    MatSliderModule,
    MatCheckboxModule,
    MatSelectModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    ProductCard,
    ProductCardSkeleton,
  ],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  productService = inject(ProductService);

  categories = signal<string[]>([]);
  loading = true;
  CategoryLoading = true;
  skeletonArray = Array.from({ length: 8 });

  constructor(
    public cartService: CartService,
    public wishlistService: WishlistService,
    private router: Router,
    private categoryService: CategoryService,
  ) {}

  ngOnInit() {
    this.productService.loadProducts();

    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories.set(response);
        this.CategoryLoading = false;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.CategoryLoading = false;
      },
    });
  }

  showAllCategories = signal(false);

  visibleCategories = computed(() =>
    this.showAllCategories() ? this.categories() : this.categories().slice(0, 5),
  );

  toggleCategories() {
    this.showAllCategories.update((value) => !value);
  }

  handleAddToCart(product: Product, quantity: number = 1) {
    this.cartService.addToCart(product, quantity);
  }

  handleAddToWishlist(product: Product) {
    this.wishlistService.toggle(product);
  }

  handleViewDetails(product: Product) {
    this.router.navigate(['/products', product.id]);
  }

  handlePageChange(event: PageEvent) {
    this.productService.limit.set(event.pageSize);
    this.productService.page.set(event.pageIndex + 1);

    this.productService.loadProducts();
  }
}
