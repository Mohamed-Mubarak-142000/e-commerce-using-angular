import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './empty-state.html',
  styleUrls: ['./empty-state.css'],
})
export class EmptyStateComponent {
  @Input() icon: string = 'shopping_cart';
  @Input() title: string = 'Your cart is empty';
  @Input() description: string = 'Start shopping to add items to your cart';
  @Input() buttonText: string = 'Continue Shopping';
  @Input() buttonRoute: string = '/products';
}
