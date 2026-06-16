import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { CartService } from '../../services/cart';
import { MatDialog } from '@angular/material/dialog';
import { OrderSuccessDialog } from '../../shared/components/order-success-dialog/order-success-dialog';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './checkout.html',
})
export class Checkout {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  cartService = inject(CartService);

  checkoutForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],

    country: ['', Validators.required],
    city: ['', Validators.required],
    address: ['', Validators.required],
    postalCode: ['', Validators.required],

    paymentMethod: ['cash', Validators.required],
  });

  subtotal = computed(() => this.cartService.cartTotal());

  shipping = computed(() => (this.cartService.cart().length ? 50 : 0));

  total = computed(() => this.subtotal() + this.shipping());

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.dialog.open(OrderSuccessDialog, {
      width: '450px',
      disableClose: true,
    });

    this.cartService.clearCart();
  }
}
