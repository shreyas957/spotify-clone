import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <div class="topbar-left">
        <button class="nav-button" (click)="goBack()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <button class="nav-button" (click)="goForward()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>

      <div class="topbar-right">
        <div class="user-menu" (click)="toggleUserMenu()">
          <div class="user-avatar">
            {{ (currentUser$ | async)?.name?.charAt(0) || 'U' }}
          </div>
          <span class="user-name">{{ (currentUser$ | async)?.name }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </div>

        <div *ngIf="showUserMenu" class="user-dropdown">
          <button  *ngIf="authService.isAuthenticated()" class="dropdown-item" (click)="goToProfile()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Profile
          </button>
          <button  *ngIf="authService.isAuthenticated()" class="dropdown-item" (click)="logout()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5z"/>
            </svg>
            Log out
          </button>
          <button  *ngIf="!authService.isAuthenticated()" class="dropdown-item" (click)="login()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5z"/>
            </svg>
            Sign In
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 32px;
      background-color: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #282828;
    }

    .topbar-left {
      display: flex;
      gap: 16px;
    }

    .nav-button {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.7);
      border: none;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .nav-button:hover {
      background-color: #282828;
      transform: scale(1.05);
    }

    .topbar-right {
      position: relative;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px 4px 4px;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 23px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .user-menu:hover {
      background-color: #282828;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #1db954;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      background-color: #282828;
      border-radius: 4px;
      box-shadow: 0 16px 24px rgba(0, 0, 0, 0.3);
      min-width: 160px;
      z-index: 1000;
      animation: slideUp 0.2s ease-out;
    }

    .dropdown-item {
      width: 100%;
      padding: 12px 16px;
      background: none;
      border: none;
      color: #fff;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }

    .dropdown-item:hover {
      background-color: #3e3e3e;
    }

    @media (max-width: 768px) {
      .topbar {
        padding: 16px 20px;
      }

      .user-name {
        display: none;
      }
    }
  `]
})
export class TopbarComponent {
  showUserMenu = false;
  currentUser$ = this.authService.currentUser$;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  goBack(): void {
    window.history.back();
  }

  goForward(): void {
    window.history.forward();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  goToProfile(): void {
    this.showUserMenu = false;
    this.router.navigate(['/app/profile']);
  }

  login(): void {
    this.router.navigate(['/auth/register'])
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/app/home']);
  }
}