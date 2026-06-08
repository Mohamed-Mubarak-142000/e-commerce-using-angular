import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../types/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private API = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.API);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API}/${id}`);
  }

  getProductsByCategory(category: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.API}/category/${category}`);
  }
}
