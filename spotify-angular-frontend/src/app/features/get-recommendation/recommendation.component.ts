import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from '../../core/services/music.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { TrackPlayerComponent } from '../../shared/components/track-player/track-player.component';
import { Track, RecommendationResponse } from '../../core/models/music.model';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule, TrackPlayerComponent],
  template: `
    <div class="recommendation-container">
      <div class="recommendation-header">
        <div class="recommendation-cover">
          <div class="recommendation-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>
        <div class="recommendation-info">
          <p class="recommendation-type">Playlist</p>
          <h1 class="recommendation-title">Recommended Songs</h1>
          <div class="recommendation-meta">
            <span class="track-count">{{ tracks.length }} songs</span>
          </div>
        </div>
      </div>

      <div class="recommendation-actions">
        <button (click)="playAlbum()" class="btn btn-primary play-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Play
        </button>
        <button class="btn btn-ghost">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
        <button class="btn btn-ghost">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </div>

      <div class="tracks-section">
        <div class="tracks-header">
          <div class="track-number-header">#</div>
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
            *ngFor="let track of tracks; let i = index; trackBy: trackByTrackId" 
            class="track-item slide-up"
            [style.animation-delay]="i * 0.05 + 's'"
            (click)="openTrackPlayer(track, i)"
          >
            <div class="track-number">{{ i + 1 }}</div>
            <div class="track-info">
              <h4 class="track-title">{{ track.name }}</h4>
              <p class="track-artist">{{ getArtistNames(track.artists) }}</p>
            </div>
            <div class="track-album">{{ track.album.name }}</div>
            <div class="track-duration">{{ formatDuration(track.duration_ms) }}</div>
            <button 
              class="btn btn-ghost track-action"
              [class.active]="wishlistService.isInWishlist(track.id)"
              (click)="toggleWishlist(track.id, $event)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading recommended tracks...</p>
    </div>

    <div *ngIf="!isLoading && tracks.length === 0" class="error-container">
      <div class="error-content">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
        <h2>No tracks found</h2>
        <p>The recommendation is currently unavailable.</p>
      </div>
    </div>
    <app-track-player
      *ngIf="showPlayer"
      [tracks]="tracks"
      [currentIndex]="playerIndex"
      [listContext]="getAlbumName()"
      (close)="closePlayer()"
      (trackChange)="onTrackChange($event)"
    ></app-track-player>
  `,
  styles: [`
    .recommendation-container {
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
      animation: fadeIn 0.5s ease-out;
    }

    .recommendation-header {
      display: flex;
      gap: 32px;
      margin-bottom: 32px;
      align-items: end;
    }

    .recommendation-cover {
      flex-shrink: 0;
    }

    .recommendation-icon {
      width: 232px;
      height: 232px;
      background: linear-gradient(135deg, #f50a51ff, #1db954 60%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 8px 40px rgba(29, 185, 84, 0.12);
    }

    .recommendation-cover img {
      width: 232px;
      height: 232px;
      border-radius: 8px;
      object-fit: cover;
      box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
    }

    .recommendation-info {
      flex: 1;
    }

    .recommendation-type {
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      margin: 0 0 8px;
      text-transform: uppercase;
    }

    .recommendation-title {
      font-size: 48px;
      font-weight: 900;
      margin: 0 0 24px;
      line-height: 1.1;
    }

    .recommendation-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #b3b3b3;
    }

    .recommendation-artist {
      color: #fff;
      font-weight: 500;
    }

    .separator {
      color: #727272;
    }

    .recommendation-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }

    .play-button {
      padding: 12px 24px;
      font-size: 16px;
    }

    .tracks-section {
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 16px;
    }

    .tracks-header {
      display: grid;
      grid-template-columns: 24px 1fr 200px 80px 48px;
      gap: 16px;
      align-items: center;
      padding: 8px 0 16px;
      border-bottom: 1px solid #282828;
      margin-bottom: 16px;
      color: #b3b3b3;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .track-duration-header {
      text-align: right;
    }

    .track-item {
      display: grid;
      grid-template-columns: 24px 1fr 200px 80px 48px;
      gap: 16px;
      align-items: center;
      padding: 8px 0;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .track-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .track-number {
      color: #b3b3b3;
      font-size: 14px;
      text-align: center;
    }

    .track-title {
      font-size: 16px;
      font-weight: 500;
      margin: 0 0 4px;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .track-artist {
      font-size: 14px;
      color: #b3b3b3;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .track-album {
      font-size: 14px;
      color: #b3b3b3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .track-duration {
      font-size: 14px;
      color: #b3b3b3;
      text-align: right;
    }

    .track-action {
      padding: 8px;
      width: 32px;
      height: 32px;
      color: #b3b3b3;
    }

    .track-action.active {
      color: #1db954;
    }

    .track-action:hover {
      color: #fff;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 400px;
      gap: 16px;
    }

    .loading-text {
      color: #b3b3b3;
      font-size: 16px;
      margin: 0;
    }

    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .error-content {
      text-align: center;
      color: #b3b3b3;
    }

    .error-content svg {
      margin-bottom: 24px;
      opacity: 0.5;
    }

    .error-content h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #fff;
    }

    .error-content p {
      font-size: 16px;
      margin: 0;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .recommendation-container {
        padding: 20px;
      }

      .recommendation-header {
        flex-direction: column;
        text-align: center;
        gap: 24px;
      }

      .recommendation-cover img {
        width: 200px;
        height: 200px;
      }

      .recommendation-title {
        font-size: 32px;
      }

      .tracks-header {
        grid-template-columns: 24px 1fr 40px;
        gap: 12px;
      }

      .track-album-header,
      .track-duration-header {
        display: none;
      }

      .track-item {
        grid-template-columns: 24px 1fr 40px;
        gap: 12px;
      }

      .track-album,
      .track-duration {
        display: none;
      }
    }
  `]
})
export class GetRecommendationComponent implements OnInit {
  recommendationResponse?: RecommendationResponse;
  tracks: Track[] = [];
  isLoading = true;
  userId: number = 0;
  showPlayer = false;
  playerIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private musicService: MusicService,
    public wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      console.log('User ID:', this.userId); // Debug log
      this.loadAlbumTracks();
    });
  }

  loadAlbumTracks(): void {
    this.isLoading = true;
    this.tracks = [];
    
    console.log('Loading tracks for recommendation:', this.userId); // Debug log
    
    this.musicService.getRecommendationsForUser(this.userId).subscribe({
        next: (recommendationResponse) => {
            this.recommendationResponse = recommendationResponse;
            console.log('Recommendation response received:', this.recommendationResponse);
            this.tracks = recommendationResponse.tracks;
            console.log('Recommendation tracks received:', this.tracks);
            this.isLoading = false;
        },
        error: (error) => {
           console.error('Error loading recommendation tracks:', error);
           this.isLoading = false;
           this.tracks = [];
        }
    });
  }

  playAlbum(): void {
    if (this.tracks && this.tracks.length > 0) {
      this.openTrackPlayer(this.tracks[0], 0);
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

  toggleWishlist(trackId: string, event: Event): void {
    event.stopPropagation();
    
    if (this.wishlistService.isInWishlist(trackId)) {
      this.wishlistService.removeFromWishlist(trackId).subscribe({
        next: () => {
          this.wishlistService.refreshWishlist();
        },
        error: (error) => {
          console.error('Error removing from wishlist:', error);
        }
      });
    } else {
      this.wishlistService.addToWishlist(trackId).subscribe({
        next: () => {
          this.wishlistService.refreshWishlist();
        },
        error: (error) => {
          console.error('Error adding to wishlist:', error);
        }
      });
    }
  }

  getAlbumImage(): string {
    if (this.tracks.length > 0 && this.tracks[0].album?.images?.length > 0) {
      return this.tracks[0].album.images[0].url;
    }
    return 'https://via.placeholder.com/300x300/1db954/000000?text=♪';
  }

  getAlbumName(): string {
    return this.tracks.length > 0 ? this.tracks[0].album?.name || 'Unknown Album' : 'Loading...';
  }

  getAlbumType(): string {
    if (this.tracks.length > 0) {
      return this.tracks[0].album?.album_type?.charAt(0).toUpperCase() + 
             this.tracks[0].album?.album_type?.slice(1) || 'Album';
    }
    return 'Album';
  }

  getArtistNames(artists?: any[]): string {
    if (artists && artists.length > 0) {
      return artists.map(artist => artist.name).join(', ');
    }
    if (this.tracks.length > 0 && this.tracks[0].album?.artists) {
      return this.tracks[0].album.artists.map(artist => artist.name).join(', ');
    }
    return 'Unknown Artist';
  }

  getAlbumYear(): string {
    if (this.tracks.length > 0) {
      const releaseDate = this.tracks[0].album?.release_date;
      return releaseDate ? new Date(releaseDate).getFullYear().toString() : '';
    }
    return '';
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