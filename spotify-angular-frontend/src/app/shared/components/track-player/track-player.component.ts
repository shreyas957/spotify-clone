import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Track } from '../../../core/models/music.model';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { PreferencesService } from '../../../core/services/preferences.service';
import { TrackPlayedEvent, TrackLikedEvent } from '../../../core/models/music.model';
import { PlayerStateService } from '../../../core/services/player-state.service';

@Component({
  selector: 'app-track-player',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('modalAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('void => *', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('* => void', [
        animate('200ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ])
    ]),
    trigger('slideAnimation', [
      state('current', style({ transform: 'translateX(0%)', opacity: 1 })),
      state('next', style({ transform: 'translateX(100%)', opacity: 0 })),
      state('prev', style({ transform: 'translateX(-100%)', opacity: 0 })),
      transition('current => next', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('next => current', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('current => prev', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('prev => current', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ])
    ])
  ],
  template: `
    <div class="player-overlay" @modalAnimation (click)="closePlayer()">
      <div class="player-container" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button class="close-button" (click)="closePlayer()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <!-- Track Content -->
        <div class="track-content" [@slideAnimation]="slideState">
          <div class="track-artwork">
            <img [src]="getTrackImage(currentTrack)" [alt]="currentTrack.name" loading="lazy">
            <div class="artwork-overlay">
              <button class="play-button">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="track-info">
            <h1 class="track-title">{{ currentTrack.name }}</h1>
            <p class="track-artist">{{ getArtistNames(currentTrack.artists) }}</p>
            <p class="track-album">{{ currentTrack.album.name }}</p>
            <div class="track-meta">
              <span class="track-duration">{{ formatDuration(currentTrack.duration_ms) }}</span>
              <span class="track-popularity">{{ currentTrack.popularity }}% popularity</span>
              <span class="track-year">{{ getYear(currentTrack.album.release_date) }}</span>
            </div>
          </div>
        </div>

        <!-- Player Controls -->
        <div class="player-controls">
          <button 
            class="control-button" 
            (click)="previousTrack()"
            [disabled]="currentIndex === 0"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          <button class="control-button play-pause">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>

          <button 
            class="control-button" 
            (click)="nextTrack()"
            [disabled]="currentIndex === tracks.length - 1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>

          <button 
            class="control-button wishlist-button"
            [class.active]="wishlistService.isInWishlist(currentTrack.id)"
            (click)="toggleWishlist()"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>

        <!-- Track Progress -->
        <div class="track-progress">
          <span class="progress-time">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progressPercentage"></div>
            <div class="progress-handle" [style.left.%]="progressPercentage"></div>
          </div>
          <span class="progress-time">{{ formatDuration(currentTrack.duration_ms) }}</span>
        </div>

        <!-- Track List Navigation -->
        <div class="track-list-info">
          <p class="current-position">
            {{ currentIndex + 1 }} of {{ tracks.length }}
          </p>
          <p class="list-context">{{ listContext }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .player-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 20px;
    }

    .player-container {
      background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
      border-radius: 24px;
      padding: 25px;
      margin-left: 10px;
      max-width: 550px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
      position: relative;
    }

    .close-button {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #b3b3b3;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      z-index: 10;
    }

    .close-button:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      transform: scale(1.1);
    }

    .track-content {
      text-align: center;
      margin-bottom: 32px;
      position: relative;
      overflow: hidden;
    }

    .track-artwork {
      position: relative;
      margin: 0 auto 32px;
      width: 300px;
      height: 300px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }

    .track-artwork img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .artwork-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .track-artwork:hover .artwork-overlay {
      opacity: 1;
    }

    .track-artwork:hover img {
      transform: scale(1.05);
    }

    .play-button {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #1db954;
      border: none;
      color: #000;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      box-shadow: 0 8px 24px rgba(29, 185, 84, 0.4);
    }

    .play-button:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 32px rgba(29, 185, 84, 0.6);
    }

    .track-title {
      font-size: 25px;
      font-weight: 700;
      margin: 0 0 12px;
      color: #fff;
      line-height: 1.2;
    }

    .track-artist {
      font-size: 15px;
      color: #1db954;
      margin: 0 0 8px;
      font-weight: 500;
    }

    .track-album {
      font-size: 16px;
      color: #b3b3b3;
      margin: 0 0 16px;
    }

    .track-meta {
      display: flex;
      justify-content: center;
      gap: 24px;
      font-size: 14px;
      color: #727272;
      flex-wrap: wrap;
    }

    .player-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      margin-bottom: 32px;
    }

    .control-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .control-button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .control-button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .play-pause {
      width: 50px;
      height: 50px;
      background: #1db954;
      color: #000;
    }

    .play-pause:hover {
      background: #1ed760;
    }

    .wishlist-button.active {
      color: #1db954;
      background: rgba(29, 185, 84, 0.2);
    }

    .track-progress {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .progress-time {
      font-size: 12px;
      color: #b3b3b3;
      min-width: 40px;
      text-align: center;
    }

    .progress-bar {
      flex: 1;
      height: 4px;
      background: #404040;
      border-radius: 2px;
      position: relative;
      cursor: pointer;
    }

    .progress-fill {
      height: 100%;
      background: #1db954;
      border-radius: 2px;
      transition: width 0.1s ease;
    }

    .progress-handle {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 12px;
      height: 12px;
      background: #fff;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .progress-bar:hover .progress-handle {
      opacity: 1;
    }

    .track-list-info {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid #404040;
    }

    .current-position {
      font-size: 14px;
      color: #fff;
      margin: 0 0 8px;
      font-weight: 600;
    }

    .list-context {
      font-size: 12px;
      color: #727272;
      margin: 0;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .player-container {
        padding: 24px;
        margin: 16px;
        border-radius: 16px;
      }

      .track-artwork {
        width: 250px;
        height: 250px;
      }

      .track-title {
        font-size: 24px;
      }

      .track-artist {
        font-size: 18px;
      }

      .player-controls {
        gap: 16px;
      }

      .control-button {
        width: 44px;
        height: 44px;
      }

      .play-pause {
        width: 56px;
        height: 56px;
      }

      .track-meta {
        gap: 16px;
        font-size: 12px;
      }
    }

    @media (max-width: 480px) {
      .track-artwork {
        width: 200px;
        height: 200px;
      }

      .track-title {
        font-size: 20px;
      }

      .track-artist {
        font-size: 16px;
      }
    }
  `]
})
export class TrackPlayerComponent implements OnInit, OnDestroy {
  @Input() tracks: Track[] = [];
  @Input() currentIndex: number = 0;
  @Input() listContext: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() trackChange = new EventEmitter<number>();

  currentTrack!: Track;
  slideState = 'current';
  currentTime = 0;
  progressPercentage = 0;
  private progressInterval?: number;

  constructor(
    public wishlistService: WishlistService,
    public preferencesService: PreferencesService,
    public authService: AuthService,
    private playerState: PlayerStateService
  ) {}

  ngOnInit(): void {
    this.updateCurrentTrack();
    this.startProgressSimulation();
    
    // Handle keyboard navigation
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
  }

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    document.removeEventListener('keydown', this.handleKeyPress.bind(this));
  }

updateCurrentTrack(): void {
  if (this.tracks.length > 0 && this.currentIndex >= 0 && this.currentIndex < this.tracks.length) {
    this.currentTrack = this.tracks[this.currentIndex];
    this.currentTime = 0;
    this.progressPercentage = 0;

    // 🔑 Push into global state so sidebar knows the recent track
    this.playerState.setCurrentTrack(this.currentTrack);

    // make track played event & save in backend DB for current user
    const currentUser = this.authService.getCurrentUser();

    const playedEvent: TrackPlayedEvent = {
      userId: currentUser!.id,
      trackId: this.currentTrack.id,
      trackName: this.currentTrack.name,
      artistIds: this.currentTrack.artists.map(a => a.id),
      genres: this.currentTrack.artists
          .map(a => a.genres || [])
          .flat(),
      msPlayed: this.currentTrack.duration_ms,
      playedAt: new Date().toISOString()
    };

    this.preferencesService.trackPlayed(playedEvent).subscribe({
      next: () => console.log(`Track played event sent for ${this.currentTrack.name}`),
      error: err => console.error('Error sending track played event', err)
    });
  }
}


  previousTrack(): void {
    if (this.currentIndex > 0) {
      this.slideState = 'prev';
      setTimeout(() => {
        this.currentIndex--;
        this.updateCurrentTrack();
        this.trackChange.emit(this.currentIndex);
        this.slideState = 'current';
      }, 200);
    }
  }

  nextTrack(): void {
    if (this.currentIndex < this.tracks.length - 1) {
      this.slideState = 'next';
      setTimeout(() => {
        this.currentIndex++;
        this.updateCurrentTrack();
        this.trackChange.emit(this.currentIndex);
        this.slideState = 'current';
      }, 200);
    }
  }

  closePlayer(): void {
    this.close.emit();
  }

  toggleWishlist(): void {
    const currentUser = this.authService.getCurrentUser();
    
    const trackLikedEvent: TrackLikedEvent = {
      userId: currentUser!.id,
      trackId: this.currentTrack.id,
      liked: true,
      likedAt: new Date().toISOString()
    }
    
    if (this.wishlistService.isInWishlist(this.currentTrack.id)) {
      this.wishlistService.removeFromWishlist(this.currentTrack.id).subscribe({
        next: () => {
          this.wishlistService.refreshWishlist();
        }
      });
    } else {
      this.wishlistService.addToWishlist(this.currentTrack.id).subscribe({
        next: () => {
          this.wishlistService.refreshWishlist();
        }
      });

      this.preferencesService.trackLiked(trackLikedEvent).subscribe({
        next: () => console.log(`Track liked event sent for ${this.currentTrack.name}`),
        error: err => console.error('Error sending track liked event', err)
      });
    }
  }

  getTrackImage(track: Track): string {
    return track.album?.images?.[0]?.url || 'https://via.placeholder.com/300x300/1db954/000000?text=♪';
  }

  getArtistNames(artists: any[]): string {
    return artists.map(artist => artist.name).join(', ');
  }

  getYear(dateString: string): string {
    return new Date(dateString).getFullYear().toString();
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  private startProgressSimulation(): void {
    // Simulate track progress for demo purposes
    this.progressInterval = window.setInterval(() => {
      if (this.currentTime < this.currentTrack.duration_ms / 1000) {
        this.currentTime += 1;
        this.progressPercentage = (this.currentTime / (this.currentTrack.duration_ms / 1000)) * 100;
      }
    }, 1000);
  }

  private stopProgressSimulation(): void {

  }
  playTrack(index: number) {
  this.currentIndex = index;
  const track = this.tracks[index];
  if (track) {
    this.playerState.setCurrentTrack(track); // 🔑 update global state
  }
}

  private handleKeyPress(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previousTrack();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextTrack();
        break;
      case 'Escape':
        event.preventDefault();
        this.closePlayer();
        break;
      case ' ':
        event.preventDefault();
        // Toggle play/pause (for future implementation)
        break;
    }
  }
}