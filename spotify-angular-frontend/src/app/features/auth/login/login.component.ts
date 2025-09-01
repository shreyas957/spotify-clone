import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="auth-container">
      <div class="auth-card" @fadeInUp>
        <div class="logo-section">
          <div class="logo">
            <img width="32" height="32" viewBox="0 0 24 24" fill="currentColor" src=" https://cdn.freebiesupply.com/logos/large/2x/spotify-2-logo-png-transparent.png" alt="">
          </div>
          <h1>Log in to Spotify</h1>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              type="email" 
              formControlName="email" 
              class="form-input"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              placeholder="Enter your email"
            >
            <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="error-message">
              Please enter a valid email address
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              formControlName="password" 
              class="form-input"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              placeholder="Enter your password"
            >
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error-message">
              Password is required
            </div>
          </div>

          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            class="btn btn-primary auth-button"
            [disabled]="loginForm.invalid || isLoading"
          >
            <div *ngIf="isLoading" class="loading-spinner"></div>
            <span *ngIf="!isLoading">Log In</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? 
            <a routerLink="/auth/register" class="text-primary">Sign up for Spotify</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Full page container */
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1db954 0%, #191414 100%);
      padding: 20px;
    }

    /* The centered card */
    .auth-card {
      width: 100%;
      max-width: 450px;
      background-color: #121212;
      padding: 48px;
      border-radius: 16px;
      border: 2px solid #282828;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }

    .logo-section {
      text-align: center;
      margin-bottom: 48px;
    }

    .logo {
      color: #1db954;
      margin-bottom: 24px;
    }

    .logo svg {
      width: 48px;
    }

    h1 {
      font-size: 32px;
      font-weight: 700;
      margin: 0;
      color: #fff;
    }

    .auth-form {
      margin-bottom: 32px;
    }

    .form-input {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #333;
      background: #181818;
      color: #fff;
      margin-top: 8px;
    }

    .form-input::placeholder {
      color: #727272;
    }

    .form-input.error {
      border-color: #e74c3c;
    }

    .form-label {
      color: #b3b3b3;
      font-weight: 500;
    }

    .error-message {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 6px;
    }

    .auth-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
      margin-top: 32px;
      background: #1db954;
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    .auth-button:disabled {
      background: #555;
      cursor: not-allowed;
    }

    .auth-footer {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid #282828;
    }

    .auth-footer p {
      color: #b3b3b3;
      margin: 0;
    }

    .auth-footer a {
      color: #1db954;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #000;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .auth-card {
        padding: 32px 24px;
      }
      
      h1 {
        font-size: 24px;
      }
      
      .form-input {
        font-size: 16px; /* Prevents zoom on iOS */
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/app/home']);
        },
        error: () => {
          this.errorMessage = 'Invalid email or password';
          this.isLoading = false;
        }
      });
    }
  }
}
