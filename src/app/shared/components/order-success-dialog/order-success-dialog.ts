import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './order-success-dialog.html',
})
export class OrderSuccessDialog {
  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/']);
  }
}
