import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../core/services/wishlist.service';
import { TrackPlayerComponent } from '../../shared/components/track-player/track-player.component';
import { Track } from '../../core/models/music.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, TrackPlayerComponent],
  template: `
    <div class="wishlist-container">
      <div class="wishlist-header">
        <div class="wishlist-cover">
          <div class="wishlist-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>
        <div class="wishlist-info">
          <p class="playlist-type">Playlist</p>
          <h1 class="playlist-title">Liked Songs</h1>
          <div class="playlist-meta">
            <span class="track-count">{{ wishlistTracks.length }} songs</span>
          </div>
        </div>
      </div>

      <div class="wishlist-actions" *ngIf="wishlistTracks.length > 0">
        <button (click)="playAlbum()" class="btn btn-primary play-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Play
        </button>
        <button class="btn btn-ghost">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
      </div>

      <div *ngIf="!isLoading && wishlistTracks.length === 0" class="empty-wishlist">
        <div class="empty-content">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <h2>Songs you like will appear here</h2>
          <p>Save songs by tapping the heart icon.</p>
        </div>
      </div>

      <div *ngIf="wishlistTracks.length > 0 && !isLoading" class="tracks-section">
        <div class="tracks-header tracks-grid">
          <div class="track-number-header">#</div>
          <div class="track-image-header"></div>
          <div class="track-title-header">Title</div>
          <div class="track-album-header">Album</div>
          <div class="track-duration-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
            </svg>
          </div>
          <div class="track-actions-header"></div>
        </div>

        <div class="tracks-list">
          <div 
            *ngFor="let track of wishlistTracks; let i = index; trackBy: trackByTrackId" 
            class="track-item tracks-grid slide-up"
            [style.animation-delay]="i * 0.05 + 's'"
            (click)="openTrackPlayer(track, i)"
          >
            <div class="track-number">{{ i + 1 }}</div>
            <div class="track-image">
              <img [src]="getTrackImage(track)" [alt]="track.name" loading="lazy">
            </div>
            <div class="track-info">
              <h4 class="track-title">{{ track.name }}</h4>
              <p class="track-artist">{{ getArtistNames(track.artists) }}</p>
            </div>
            <div class="track-album">{{ track.album.name }}</div>
            <div class="track-duration">{{ formatDuration(track.duration_ms) }}</div>
            <button 
              class="btn btn-ghost track-action active"
              (click)="removeFromWishlist(track.id, $event)"
              title="Remove from liked"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <app-track-player
        *ngIf="showPlayer"
        [tracks]="wishlistTracks"
        [currentIndex]="playerIndex"
        [listContext]="'Liked Songs'"
        (close)="closePlayer()"
        (trackChange)="onTrackChange($event)"
      ></app-track-player>
    </div>
  `,
  styles: [`
    :host {
      --grid-cols: 24px 48px 1fr 120px 40px 55px;
    }

    .wishlist-container {
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
      color: #fff;
      font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }

    .wishlist-header {
      display: flex;
      gap: 32px;
      margin-bottom: 32px;
      align-items: end;
    }

    .wishlist-cover {
      flex-shrink: 0;
    }

    .wishlist-icon {
      width: 232px;
      height: 232px;
      background: linear-gradient(135deg, #450af5, #1db954 60%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 8px 40px rgba(29, 185, 84, 0.12);
    }

    .wishlist-info {
      flex: 1;
      min-width: 0;
    }

    .playlist-type {
      font-size: 13px;
      font-weight: 600;
      color: #cfcfcf;
      margin: 0 0 8px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .playlist-title {
      font-size: 44px;
      font-weight: 800;
      margin: 0 0 12px;
      line-height: 1.05;
      color: #ffffff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .playlist-meta {
      font-size: 14px;
      color: #b3b3b3;
    }

    .wishlist-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .play-button {
      padding: 12px 24px;
      font-size: 16px;
      display:flex;
      gap:8px;
      align-items:center;
      border-radius: 999px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 260px;
    }

    .empty-wishlist {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 260px;
    }

    .empty-content {
      text-align: center;
      color: #b3b3b3;
    }

    .empty-content svg {
      margin-bottom: 18px;
      opacity: 0.6;
    }

    .empty-content h2 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #fff;
    }

    .empty-content p {
      font-size: 14px;
      margin: 0;
    }

    .tracks-grid {
      display: grid;
      grid-template-columns: var(--grid-cols);
      gap: 16px;
      align-items: center;
      width: 100%;
    }

    .tracks-header {
      padding: 8px 0 12px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      margin-bottom: 12px;
      color: #bdbdbd;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .track-number-header,
    .track-number {
      text-align: center;
      color: #bdbdbd;
      font-size: 13px;
    }

    .track-image-header { }

    .track-image {
      width: 40px;
      height: 40px;
      display:flex;
      align-items:center;
      justify-content:center;
    }

    .track-image img {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      object-fit: cover;
    }

    .track-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
      gap: 2px;
    }

    .track-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .track-artist {
      font-size: 13px;
      color: #bdbdbd;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .track-album {
      font-size: 14px;
      color: #bdbdbd;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .track-duration-header,
    .track-duration {
      text-align: right;
      padding-right: 4px;
      font-size: 13px;
      color: #bdbdbd;
      white-space: nowrap;
    }

    .track-item {
      padding: 10px 0;
      border-radius: 6px;
      transition: background-color 0.15s ease;
      cursor: pointer;
      align-items: center;
    }

    .track-item:hover {
      background-color: rgba(255,255,255,0.03);
    }

    .track-action {
      padding: 8px;
      width: 36px;
      height: 36px;
      color: #1db954;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius: 6px;
    }

    .track-action:hover {
      color: #1ed760;
      background: rgba(255,255,255,0.02);
    }

    @media (max-width: 1024px) {
      :host {
        --grid-cols: 24px 48px 1fr 120px 60px 48px;
      }

      .playlist-title {
        font-size: 36px;
      }

      .wishlist-icon {
        width: 180px;
        height: 180px;
      }
    }

    @media (max-width: 768px) {
      :host {
        --grid-cols: 24px 40px 1fr 0px 0px 48px;
      }

      .track-album-header,
      .track-duration-header,
      .track-album,
      .track-duration {
        display: none;
      }

      .playlist-title {
        font-size: 28px;
      }

      .wishlist-header {
        flex-direction: column;
        text-align: center;
        align-items: center;
        gap: 20px;
      }

      .wishlist-icon {
        width: 160px;
        height: 160px;
      }
    }

    @media (max-width: 480px) {
      :host {
        --grid-cols: 20px 36px 1fr 0px 0px 40px;
      }

      .wishlist-container {
        padding: 16px;
      }

      .playlist-title {
        font-size: 22px;
      }

      .playlist-meta {
        font-size: 12px;
      }

      .track-title {
        font-size: 14px;
      }

      .track-artist {
        font-size: 12px;
      }

      .track-image img {
        width: 36px;
        height: 36px;
      }

      .track-action {
        width: 40px;
        height: 40px;
      }
    }
  `]
})
export class WishlistComponent implements OnInit {
  wishlistTracks: Track[] = [];
  isLoading = true;
  showPlayer = false;
  playerIndex = 0;

  constructor(public wishlistService: WishlistService) {}

  ngOnInit(): void {
      this.wishlistService.wishlist$.subscribe({
      next: (tracks) => {
        this.wishlistTracks = tracks;
        this.isLoading = false;
      }
    });
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistService.getWishlist().subscribe({
      next: (tracks) => {
        this.wishlistTracks = tracks;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.isLoading = false;
      }
    });
  }

  playAlbum(): void {
    if (this.wishlistTracks && this.wishlistTracks.length > 0) {
      this.openTrackPlayer(this.wishlistTracks[0], 0);
    }
  }

  openTrackPlayer(track: Track, index: number): void {
    this.playerIndex = index;
    this.showPlayer = true;
  }

  closePlayer(): void {
    this.showPlayer = false;
  }

  onTrackChange(newIndex: number): void {
    this.playerIndex = newIndex;
  }

  removeFromWishlist(trackId: string, event: Event): void {
    event.stopPropagation();
    
    this.wishlistService.removeFromWishlist(trackId).subscribe({
      next: () => {
        this.wishlistTracks = this.wishlistTracks.filter(track => track.id !== trackId);
        this.wishlistService.refreshWishlist();
      }
    });
  }

  getTrackImage(track: Track): string {
    return track.album?.images?.[2]?.url || 'https://via.placeholder.com/64x64/1db954/000000?text=♪';
  }

  getArtistNames(artists: any[]): string {
    return artists.map(artist => artist.name).join(', ');
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  trackByTrackId(index: number, track: Track): string {
    return track.id;
  }
}
