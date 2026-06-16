import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private http = inject(HttpClient);

  private baseUrl = 'https://dummyjson.com/auth/login';

  // global user state
  currentUser = signal<any>(null);

  login(username: string, password: string) {
    const payload = {
      username,
      password,
      expiresInMins: 30,
    };

    return this.http.post(this.baseUrl, payload);
  }

  saveSession(user: any) {
    localStorage.setItem('accessToken', user.accessToken);
    this.currentUser.set(user);
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  getUserProfile() {
    const token = this.getToken();

    return this.http.get('https://dummyjson.com/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  loadUser() {
    const token = this.getToken();
    if (!token) return;

    this.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser.set(user);
        console.log('User', user);
      },
      error: () => {
        this.logout();
      },
    });
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.currentUser.set(null);
  }
}
