import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MusicService } from '../../core/services/music.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { TrackPlayerComponent } from '../../shared/components/track-player/track-player.component';
import { Track } from '../../core/models/music.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, TrackPlayerComponent],
  template: `
    <div class="search-container preserve-spaces">
      <div class="search-header">
        <h1>Search</h1>
        <div class="search-input-container">
          <svg class="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input 
            type="text" 
            [(ngModel)]="searchQuery"
            (input)="onSearchInput($event)"
            placeholder="What do you want to listen to?"
            class="search-input"
          >
          <button 
            *ngIf="searchQuery" 
            class="clear-button"
            (click)="clearSearch()"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
      </div>

      <div *ngIf="!searchQuery && !isLoading" class="search-placeholder">
        <div class="placeholder-content">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <h2>Search for music</h2>
          <p>Find your favorite songs, albums, and artists</p>
        </div>
      </div>

      <div *ngIf="searchResults.length > 0 && !isLoading" class="search-results">
        <h2>Songs</h2>
        <div class="tracks-list">
          <div 
            *ngFor="let track of searchResults; let i = index; trackBy: trackByTrackId" 
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

      <div *ngIf="searchQuery && searchResults.length === 0 && !isLoading" class="no-results">
        <h2>No results found for "{{ searchQuery }}"</h2>
        <p>Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
      </div>

      <!-- Track Player Popup -->
      <app-track-player
        *ngIf="showPlayer"
        [tracks]="searchResults"
        [currentIndex]="playerIndex"
        [listContext]="'Search Results for ' + searchQuery"
        (close)="closePlayer()"
        (trackChange)="onTrackChange($event)">
      </app-track-player>

    </div>
  `,
  styles: [`
    .preserve-spaces {
      white-space: pre-wrap;   /* or pre, pre-line */
    }

    .search-container {
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .search-header {
      margin-bottom: 32px;
    }

    .search-header h1 {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 24px;
    }

    .search-input-container {
      position: relative;
      max-width: 400px;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #b3b3b3;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 12px 48px 12px 48px;
      border: none;
      border-radius: 500px;
      background-color: #242424;
      color: #fff;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      background-color: #2a2a2a;
      box-shadow: 0 0 0 2px #1db954;
    }

    .clear-button {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #b3b3b3;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .clear-button:hover {
      color: #fff;
      background-color: rgba(255, 255, 255, 0.1);
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 64px 0;
    }

    .search-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }

    .placeholder-content {
      text-align: center;
      color: #b3b3b3;
    }

    .placeholder-content svg {
      margin-bottom: 24px;
      opacity: 0.5;
    }

    .placeholder-content h2 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .placeholder-content p {
      font-size: 16px;
      margin: 0;
    }

    .search-results h2 {
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

    .no-results {
      text-align: center;
      padding: 64px 0;
    }

    .no-results h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .no-results p {
      color: #b3b3b3;
      font-size: 16px;
      margin: 0;
    }

    @media (max-width: 768px) {
      .search-container {
        padding: 20px;
      }

      .search-header h1 {
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
export class SearchComponent {
  searchQuery = '';
  searchResults: Track[] = [];
  isLoading = false;
  private searchSubject = new Subject<string>();
  showPlayer = false;
  playerIndex = 0;

  constructor(
    private musicService: MusicService,
    public wishlistService: WishlistService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.trim()) {
        this.performSearch(query);
      } else {
        this.searchResults = [];
      }
    });
  }

  onSearchInput(event: any): void {
    const query = event.target.value;
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }

  performSearch(query: string): void {
    this.isLoading = true;
    this.musicService.searchTracks(query).subscribe({
      next: (response) => {
        this.searchResults = response.tracks.items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isLoading = false;
      }
    });
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