import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wish-list';
import { CategoryService } from '../../services/category-service';
import { ToastService } from '../../services/toast-service';

import { Product } from '../../types/product';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { ProductCardSkeleton } from '../../shared/components/product-card-skeleton/product-card-skeleton';
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from '../../shared/components/filters-dialog/filters-dialog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductCard,
    ProductCardSkeleton,
    MatSliderModule,
    MatSelectModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  productService = inject(ProductService);
  private dialog = inject(MatDialog);

  categories = signal<string[]>([]);
  CategoryLoading = true;

  showAllCategories = signal(false);

  skeletonArray = Array.from({ length: 8 });

  constructor(
    public cartService: CartService,
    public wishlistService: WishlistService,
    private router: Router,
    private categoryService: CategoryService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.productService.loadProducts();

    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res);
        this.CategoryLoading = false;
      },
      error: () => {
        this.CategoryLoading = false;
      },
    });
  }

  openFilters() {
    this.dialog.open(FiltersDialogComponent, {
      width: '350px',
      maxWidth: '95vw',
    });
  }

  visibleCategories = computed(() =>
    this.showAllCategories() ? this.categories() : this.categories().slice(0, 5),
  );

  // ================= INPUTS =================

  onSearch(event: Event) {
    this.productService.setSearch((event.target as HTMLInputElement).value);
  }

  onPriceChange(event: any) {
    this.productService.setPrice(Number(event.target.value));
  }

  onCategoryToggle(cat: string) {
    this.productService.toggleCategory(cat);
  }

  onSortChange(value: string) {
    this.productService.setSort(value);
  }

  toggleCategories() {
    this.showAllCategories.update((v) => !v);
  }

  // ================= ACTIONS =================

  handleAddToCart(product: Product, quantity: number) {
    this.cartService.addToCart(product, quantity);

    this.toastService.show('Added to cart');
  }

  handleAddToWishlist(product: Product) {
    this.wishlistService.toggle(product);

    this.toastService.show('Added to wishlist');
  }

  handlePageChange(event: PageEvent) {
    this.productService.limit.set(event.pageSize);
    this.productService.page.set(event.pageIndex + 1);

    this.productService.loadProducts();
  }

  handleViewDetails(product: Product) {
    this.router.navigate(['/products', product.id]);
  }
}
