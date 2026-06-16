import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { UserAuthService } from '../../services/user';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userAuthService = inject(UserAuthService);
  private toast = inject(ToastService);

  hidePassword = signal(true);
  loading = signal(false);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  togglePassword() {
    this.hidePassword.update((value) => !value);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.loading.set(true);

    this.userAuthService.login(username!, password!).subscribe({
      next: (res: any) => {
        // SAVE SESSION
        this.userAuthService.saveSession(res);

        this.toast.show('Login successful!');

        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toast.show('Login failed');
        this.loading.set(false);
      },
    });
  }
  get username() {
    return this.loginForm.controls.username;
  }

  get password() {
    return this.loginForm.controls.password;
  }
}
