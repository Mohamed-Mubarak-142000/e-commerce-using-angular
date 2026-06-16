import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UserAuthService } from '../../services/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './profile.html',
})
export class Profile {
  private auth = inject(UserAuthService);

  user = this.auth.currentUser;

  avatar = computed(() => this.user()?.image || 'https://i.pravatar.cc/300');

  profileForm = new FormBuilder().group({
    firstName: [''],
    lastName: [''],
    email: [''],
    phone: [''],
  });

  passwordForm = new FormBuilder().group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  orders = computed(() => {
    return this.user()?.orders || [];
  });

  ngOnInit() {
    const u = this.user();

    if (!u) {
      this.auth.loadUser();
      return;
    }

    this.profileForm.patchValue({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone,
    });
  }

  saveProfile() {
    console.log('Updated user:', this.profileForm.value);
  }

  changePassword() {
    console.log(this.passwordForm.value);
  }
}
