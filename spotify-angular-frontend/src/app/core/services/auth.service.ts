import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setSession(response);
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users`, userData)
      .pipe(
        tap(() => {
          // After successful registration, automatically login
          this.login({ email: userData.email, password: userData.password }).subscribe();
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userResponseDto');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateCurrentUser(user: User): void {
    localStorage.setItem('userResponseDto', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('userResponseDto', JSON.stringify(authResponse.userResponseDto));
    this.currentUserSubject.next(authResponse.userResponseDto);
  }

  private loadUserFromStorage(): void {
    const userResponseDto = localStorage.getItem('userResponseDto');
    if (userResponseDto) {
      this.currentUserSubject.next(JSON.parse(userResponseDto));
    }
  }
}