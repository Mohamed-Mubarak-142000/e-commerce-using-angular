import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './quantity-selector.html',
  styleUrls: ['./quantity-selector.css'],
})
export class QuantitySelectorComponent {
  @Input() quantity: number = 1;
  @Output() increase = new EventEmitter<void>();
  @Output() decrease = new EventEmitter<void>();

  onIncrease() {
    this.increase.emit();
  }

  onDecrease() {
    if (this.quantity > 1) {
      this.decrease.emit();
    }
  }
}
