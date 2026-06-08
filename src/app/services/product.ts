import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../types/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  private baseUrl = 'https://dummyjson.com/products';

  // =========================
  // 📌 STATE (Signals)
  // =========================
  page = signal(1);
  limit = signal(10);
  total = signal(0);

  loading = signal(false);
  products = signal<Product[]>([]);

  // =========================
  // 📌 COMPUTED VALUES
  // =========================
  skip = computed(() => (this.page() - 1) * this.limit());

  totalPages = computed(() => Math.ceil(this.total() / this.limit()));

  // =========================
  // 📌 FETCH DATA (Signal-based)
  // =========================
  loadProducts() {
    this.loading.set(true);

    const url = `${this.baseUrl}?limit=${this.limit()}&skip=${this.skip()}`;

    this.http.get<ProductResponse>(url).subscribe({
      next: (res) => {
        this.products.set(res.products);
        console.log('Products loaded:', res.products);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        console.log('Failed to load products');
      },
    });
  }

  // =========================
  // 📌 Pagination Actions
  // =========================
  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.loadProducts();
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadProducts();
    }
  }

  goToPage(page: number) {
    this.page.set(page);
    this.loadProducts();
  }

  getProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.baseUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getProductsByCategory(category: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/category/${category}`);
  }
}
