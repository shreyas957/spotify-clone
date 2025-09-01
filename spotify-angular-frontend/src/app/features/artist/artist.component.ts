import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from '../../core/services/music.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { TrackPlayerComponent } from '../../shared/components/track-player/track-player.component';
import { Track } from '../../core/models/music.model';
import { ArtistSelectionService } from '../../core/services/artist-selection.service';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule, TrackPlayerComponent],
  template: `
    <div class="artist-container" *ngIf="!isLoading">
      <div class="artist-header">
        <div class="artist-image">
          <div class="artist-placeholder">
            <img
              *ngIf="artistImage !== ''"
              [src]="artistImage"
              class="artist-photo"
              viewBox="0 0 24 24"
            />
            <svg *ngIf="artistImage === ''" width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
        <div class="artist-info">
          <p class="artist-type">Artist</p>
          <h1 class="artist-name">{{ artistName }}</h1>
          <p class="artist-stats">{{ tracks.length }} popular songs</p>
        </div>
      </div>

      <div class="artist-actions">
        <button class="btn btn-primary play-button" (click)="playArtist()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Play
        </button>
        <button class="btn btn-ghost">Follow</button>
      </div>

      <div class="tracks-section">
        <h2>Popular</h2>
        <div class="tracks-list">
          <div 
            *ngFor="let track of tracks; let i = index; trackBy: trackByTrackId" 
            class="track-item slide-up"
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
    </div>
    <!-- Track Player Popup -->
      <app-track-player
        *ngIf="showPlayer"
        [tracks]="tracks"
        [currentIndex]="playerIndex"
        [listContext]="artistName + ' - Popular'"
        (close)="closePlayer()"
        (trackChange)="onTrackChange($event)"
      ></app-track-player>
  `,
  styles: [`
    .artist-container {
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .artist-header {
      display: flex;
      gap: 32px;
      margin-bottom: 32px;
      align-items: end;
    }

    .artist-image {
      flex-shrink: 0;
    }

    .artist-placeholder {
      width: 232px;
      height: 232px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1db954, #1ed760);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
    }

    .artist-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;            
      border-radius: 50%;         
    }

    .artist-info {
      flex: 1;
    }

    .artist-type {
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      margin: 0 0 8px;
      text-transform: uppercase;
    }

    .artist-name {
      font-size: 48px;
      font-weight: 900;
      margin: 0 0 16px;
      line-height: 1.1;
    }

    .artist-stats {
      font-size: 16px;
      color: #b3b3b3;
      margin: 0;
    }

    .artist-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }

    .play-button {
      padding: 12px 24px;
      font-size: 16px;
    }

    .tracks-section h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 24px;
    }

    .tracks-list {
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 16px;
    }

    .track-item {
      display: grid;
      grid-template-columns: 24px 48px 1fr 200px 80px 48px;
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

    .track-image img {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      object-fit: cover;
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
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    @media (max-width: 768px) {
      .artist-container {
        padding: 20px;
      }

      .artist-header {
        flex-direction: column;
        text-align: center;
        gap: 24px;
      }

      .artist-placeholder {
        width: 200px;
        height: 200px;
      }

      .artist-name {
        font-size: 32px;
      }

      .track-item {
        grid-template-columns: 24px 40px 1fr 40px;
        gap: 12px;
      }

      .track-album,
      .track-duration {
        display: none;
      }
    }
  `]
})
export class ArtistComponent implements OnInit {
  tracks: Track[] = [];
  artistName = '';
  isLoading = true;
  artistId: string = '';
  artistImage: string = '';
  showPlayer = false;
  playerIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private musicService: MusicService,
    public wishlistService: WishlistService,
    private artistSelectionService: ArtistSelectionService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.artistId = params['id'];
      this.loadArtistTopTracks();

      this.artistSelectionService.selectedArtist$.subscribe(artist => {
        if (artist && artist.id === this.artistId) {
          this.artistImage = artist.image;
        }
      });
    });
  }

  loadArtistTopTracks(): void {
    this.musicService.getArtistTopTracks(this.artistId).subscribe({
      next: (response) => {
        this.tracks = response.tracks;
        this.artistName = this.tracks[0]?.artists[0]?.name || 'Unknown Artist';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading artist tracks:', error);
        this.isLoading = false;
      }
    });
  }

  playArtist(): void {
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
        }
      });
    } else {
      this.wishlistService.addToWishlist(trackId).subscribe({
        next: () => {
          this.wishlistService.refreshWishlist();
        }
      });
    }
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