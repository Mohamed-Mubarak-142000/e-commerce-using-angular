import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Product, ProductResponse } from '../types/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private baseUrl = 'https://dummyjson.com/products';

  // =========================
  // STATE
  // =========================
  page = signal(1);
  limit = signal(10);
  total = signal(0);

  search = signal('');
  categories = signal<string[]>([]);

  sortBy = signal('');
  order = signal<'asc' | 'desc'>('asc');

  minPrice = signal(0);
  maxPrice = signal(5000);

  loading = signal<'idle' | 'loading' | 'error'>('idle');

  products = signal<Product[]>([]);

  // =========================
  // DEBOUNCE
  // =========================
  private search$ = new Subject<string>();
  private price$ = new Subject<number>();

  constructor() {
    this.search$.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
      this.search.set(value);
      this.page.set(1);
      this.loadProducts();
    });

    this.price$.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
      this.maxPrice.set(value);
      this.page.set(1);
      this.loadProducts();
    });
  }

  // =========================
  // INPUTS
  // =========================
  setSearch(value: string) {
    this.search$.next(value);
  }

  setPrice(value: number) {
    this.price$.next(value);
  }

  toggleCategory(cat: string) {
    const current = this.categories();

    this.categories.set(
      current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat],
    );

    this.page.set(1);
    this.loadProducts();
  }

  setSort(value: string) {
    if (value === 'priceAsc') {
      this.sortBy.set('price');
      this.order.set('asc');
    }

    if (value === 'priceDesc') {
      this.sortBy.set('price');
      this.order.set('desc');
    }

    if (value === 'rating') {
      this.sortBy.set('rating');
      this.order.set('desc');
    }

    this.loadProducts();
  }

  resetFilters() {
    this.search.set('');
    this.categories.set([]);
    this.minPrice.set(0);
    this.maxPrice.set(5000);
    this.sortBy.set('');
    this.order.set('asc');
    this.page.set(1);

    this.loadProducts();
  }

  // =========================
  // COMPUTED
  // =========================
  skip = computed(() => (this.page() - 1) * this.limit());

  totalPages = computed(() => Math.ceil(this.total() / this.limit()));

  queryParams = computed(() => {
    const params: any = {
      limit: this.limit(),
      skip: this.skip(),
    };

    if (this.search()) params.q = this.search();
    if (this.sortBy()) params.sortBy = this.sortBy();
    if (this.order()) params.order = this.order();

    return params;
  });

  // =========================
  // LOAD
  // =========================
  loadProducts() {
    this.loading.set('loading');

    this.http
      .get<ProductResponse>(this.baseUrl, {
        params: this.queryParams(),
      })
      .subscribe({
        next: (res) => {
          let products = res.products;

          products = products.filter(
            (p) => p.price >= this.minPrice() && p.price <= this.maxPrice(),
          );

          if (this.categories().length) {
            products = products.filter((p) => this.categories().includes(p.category));
          }

          this.products.set(products);
          this.total.set(res.total);

          this.syncUrl();

          this.loading.set('idle'); // ✔ بعد النجاح
        },
        error: () => {
          this.loading.set('error'); // ✔
        },
      });
  }

  // =========================
  // URL SYNC
  // =========================
  syncUrl() {
    this.router.navigate([], {
      queryParams: {
        q: this.search(),
        page: this.page(),
        minPrice: this.minPrice(),
        maxPrice: this.maxPrice(),
        sortBy: this.sortBy(),
        order: this.order(),
        categories: this.categories().join(','),
      },
      queryParamsHandling: 'merge',
    });
  }

  // =========================
  // REQUIRED API METHODS (FIX ERROR)
  // =========================
  getProductById(id: number) {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getProductsByCategory(category: string) {
    return this.http.get<ProductResponse>(`${this.baseUrl}/category/${category}`);
  }

  // =========================
  // PAGINATION
  // =========================
  goToPage(page: number) {
    this.page.set(page);
    this.loadProducts();
  }
}
