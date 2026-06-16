import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeroComponent } from '../../shared/components/hero/hero';
import { HeaderSection } from '../../shared/components/header-section/header-section';
import { SliderComponent } from '../../shared/components/slider/slider';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { ProductService } from '../../services/product';
import { CommonModule } from '@angular/common';
import { Product } from '../../types/product';
import { ProductCardSkeleton } from '../../shared/components/product-card-skeleton/product-card-skeleton';
import { WishlistService } from '../../services/wish-list';
import { CartService } from '../../services/cart';
import { CategoryService } from '../../services/category-service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    HeaderSection,
    SliderComponent,
    ProductCardSkeleton,
    ProductCard,
    MatIconModule,
    CommonModule,
    MatChipsModule,
    MatCardModule,
    MatPaginatorModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  productService = inject(ProductService);

  categories: string[] = [];
  loading = true;
  CategoryLoading = true;
  skeletonArray = Array.from({ length: 8 });
  skeletonCategories = Array.from({ length: 4 });

  constructor(
    public cartService: CartService,
    public wishlistService: WishlistService,
    private router: Router,
    private categoryService: CategoryService,
  ) {}

  ngOnInit() {
    this.productService.loadProducts();

    // 👇 Categories
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.CategoryLoading = false;
        this.categories = res;
      },
      error: () => {
        this.CategoryLoading = false;
      },
    });
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
