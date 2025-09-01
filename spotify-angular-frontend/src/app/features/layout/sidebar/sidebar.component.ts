import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Track } from '../../../core/models/music.model';
import { WishlistService } from '../../../core/services/wishlist.service';
import { PlayerStateService } from '../../../core/services/player-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <img width="32" height="32" viewBox="0 0 24 24" fill="currentColor" src=" https://cdn.freebiesupply.com/logos/large/2x/spotify-2-logo-png-transparent.png" alt="">
          <span [routerLink]='["/app","/home"]' class="logo-text">Spotify</span>
        </div>
      </div>

      <div class="sidebar-nav">
        <ul class="nav-list">
          <li>
            <a routerLink="/app/home" routerLinkActive="active" class="nav-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.1L1 12h3v9h6v-6h4v6h6v-9h3L12 2.1z"/>
              </svg>
              <span class="nav-text">Home</span>
            </a>
          </li>
          <li>
            <a routerLink="/app/search" routerLinkActive="active" class="nav-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <span class="nav-text">Search</span>
            </a>
          </li>
          <li>
            <a routerLink="/app/wishlist" routerLinkActive="active" class="nav-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span class="nav-text">Your Library</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <div class="playlist-section">
          <h3>Recently Played</h3>
            <!-- recent track card -->
              <div class="playlist-item" *ngIf="recentTrack" (click)="togglePlayer()">
                <img 
                  [src]="getTrackImage(recentTrack)" 
                  [alt]="recentTrack.name"
                  class="playlist-icon"/>
                  <span class="playlist-name">{{ recentTrack.name }}</span>
              </div>

            <div class="playlist-item" *ngIf="!recentTrack">
              <div class="playlist-item">
                <div class="playlist-icon">♪</div>
                <span class="playlist-name">Liked Songs</span>
              </div>
            </div>
        </div>
      </div>
  </nav>
  `,
  styles: [`
    .sidebar {
      background-color: #000;
      height: 100vh;
      padding: 24px 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #282828;
    }

    .sidebar-header {
      padding: 0 24px 32px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #fff;
    }

    .logo svg {
      color: #1db954;
    }

    .logo-text {
      font-size: 24px;
      font-weight: 700;
    }

    .sidebar-nav {
      flex: 1;
      padding: 0 8px;
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      color: #b3b3b3;
      text-decoration: none;
      border-radius: 4px;
      margin-bottom: 8px;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .nav-item:hover {
      color: #fff;
      background-color: #1a1a1a;
    }

    .nav-item.active {
      color: #fff;
      background-color: #282828;
    }

    .nav-text {
      font-size: 14px;
    }

    .sidebar-footer {
      padding: 24px;
      border-top: 1px solid #282828;
    }

    .playlist-section h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #b3b3b3;
    }

    .playlist-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      color: #b3b3b3;
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .playlist-item:hover {
      color: #fff;
    }

    .playlist-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #450af5, #c4efd9);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #fff;
    }

    .playlist-name {
      font-size: 14px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 72px;
        padding: 24px 8px;
      }

      .logo-text,
      .nav-text,
      .sidebar-footer {
        display: none;
      }

      .nav-item {
        justify-content: center;
        padding: 12px;
      }
    }
  `]
})
export class SidebarComponent {

  isPlayerVisible = false;

  // all tracks (wishlist for now, but you can swap with "recently played" service)
  tracks: Track[] = [];

  // keep track of which song to show in footer
  currentIndex = 0;
  recentTrack: Track | null = null;

  constructor(
  private wishlistService: WishlistService,
  private playerState: PlayerStateService
) {
  // load wishlist tracks
  this.wishlistService.wishlist$.subscribe(songs => {
    this.tracks = songs;
  });
  this.playerState.currentTrack$.subscribe(track => {
    if (track) {
      this.recentTrack = track;
    }
  });
}


  togglePlayer() {
    this.isPlayerVisible = !this.isPlayerVisible;
  }

  // update footer track whenever TrackPlayer emits index change
  onTrackChange(index: number) {
    this.currentIndex = index;
    this.recentTrack = this.tracks[index];
  }
  

  getTrackImage(track: Track | null): string {
    return track?.album?.images?.[0]?.url || 'assets/default-cover.png';
  }
}