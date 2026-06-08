import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-actions.html',
  styleUrls: ['./product-actions.css'],
})
export class ProductActions {
  @Input() quantity: number = 1;

  @Output() increase = new EventEmitter<void>();
  @Output() decrease = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<void>();

  onIncrease() {
    this.increase.emit();
  }

  onDecrease() {
    this.decrease.emit();
  }

  onAddToCart() {
    this.addToCart.emit();
  }
}
