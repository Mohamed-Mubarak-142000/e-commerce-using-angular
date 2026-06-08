import { Component } from '@angular/core';
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

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    HeaderSection,
    SliderComponent,
    ProductCardSkeleton,
    ProductCard,
    CommonModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  categories = [
    { name: 'Smartphones', image: 'assets/categories/smartphones.jpg' },
    { name: 'Laptops', image: 'assets/categories/laptops.jpg' },
    { name: 'Fragrances', image: 'assets/categories/fragrances.jpg' },
    { name: 'Skincare', image: 'assets/categories/skincare.jpg' },
    { name: 'Groceries', image: 'assets/categories/groceries.jpg' },
    { name: 'Home Decoration', image: 'assets/categories/home-decoration.jpg' },
  ];

  products: Product[] = [];
  loading = true;
  skeletonArray = Array.from({ length: 8 });
  constructor(
    private productService: ProductService,
    public cartService: CartService,
    public wishlistService: WishlistService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res.products;
        this.loading = false;
      },
      error: (err) => {
        console.log('ERROR:', err);
        this.loading = false;
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
}
