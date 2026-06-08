import { HttpClient } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private API = 'https://dummyjson.com/products/category-list';
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<string[]>(this.API);
  }
}
