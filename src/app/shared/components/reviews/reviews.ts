import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ProductReview } from '../../../types/product';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.css'],
})
export class ReviewsComponent {
  @Input() reviews: ProductReview[] = [];

  getRatingArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }
}
