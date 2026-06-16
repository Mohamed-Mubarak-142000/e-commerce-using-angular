import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../../services/product';
import { CategoryService } from '../../../services/category-service';

@Component({
  selector: 'app-filters-dialog',
  standalone: true,
  imports: [CommonModule, MatSliderModule, MatSelectModule, MatOptionModule, MatDialogModule],
  templateUrl: './filters-dialog.html',
})
export class FiltersDialogComponent {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);

  categories = signal<string[]>([]);
  CategoryLoading = true;

  showAllCategories = signal(false);

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res);
        this.CategoryLoading = false;
      },
      error: () => (this.CategoryLoading = false),
    });
  }

  visibleCategories = computed(() =>
    this.showAllCategories() ? this.categories() : this.categories().slice(0, 5),
  );

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
}
