import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MusicService } from '../../core/services/music.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { TrackPlayerComponent } from '../../shared/components/track-player/track-player.component';
import { Album, Artist, Track } from '../../core/models/music.model';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { ArtistSelectionService } from '../../core/services/artist-selection.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TrackPlayerComponent],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1 class="hero-title fade-in">Good {{ getTimeOfDay() }}</h1>
        <p class="hero-subtitle fade-in">Discover new music and artists</p>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2>New Releases</h2>
          <button class="btn btn-ghost get-recommendations-btn" (click)="openRecommendation(userId)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Get Recommendations
          </button>
        </div>

        <div *ngIf="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
        </div>

        <div *ngIf="!isLoading && albums.length > 0" class="albums-grid">
          <div 
            *ngFor="let album of albums; trackBy: trackByAlbumId" 
            class="album-card card slide-up"
            (click)="openAlbum(album.id)"
            
          >
            <div class="album-image">
              <img [src]="getAlbumImage(album)" [alt]="album.name" loading="lazy">
              <div class="play-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <div class="album-info">
              <h3 class="album-title">{{ album.name }}</h3>
              <p class="album-artist">{{ getArtistNames(album.artists) }}</p>
              <p class="album-year">{{ getYear(album.release_date) }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="showRecommendations && recommendations.length > 0" class="recommendations-section">
          <h2>Recommended for You</h2>
          <div class="tracks-list">
            <div 
              *ngFor="let track of recommendations; let i = index; trackBy: trackByTrackId" 
              class="track-item slide-up"
              [style.animation-delay]="i * 0.1 + 's'"
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
              <button class="btn btn-ghost track-action" (click)="addToWishlist(track.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="authService.isAuthenticated() && userArtists.length > 0" class="artists-section">
          <h2>Your Artists</h2>
          <div class="artists-grid">
            <div 
              *ngFor="let artist of userArtists; trackBy: trackByArtistId" 
              class="artist-card card slide-up"
              (click)="openArtist(artist.id)"
            >
              <div class="artist-image">
                <div class="artist-placeholder">
                  <img
                  *ngIf="artist.images && artist.images.length > 0"
                  [src]="artist.images[0].url"
                  [alt]="artist.name"
                  class="artist-photo"
                  width="122"
                  height="122"
                  viewBox="0 0 24 24"
                  loading="lazy"
                />
                </div>
              </div>
              <div class="artist-info">
                <h3 class="artist-name">{{ artist.name }}</h3>
                <p class="artist-type">Artist</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Track Player Popup -->
      <app-track-player
        *ngIf="showPlayer"
        [tracks]="playerTracks"
        [currentIndex]="playerIndex"
        [listContext]="playerContext"
        (close)="closePlayer()"
        (trackChange)="onTrackChange($event)"
      ></app-track-player>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 0 32px 32px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .hero-section {
      padding: 32px 0 48px;
    }

    .hero-title {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #1db954, #1ed760);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 18px;
      color: #b3b3b3;
      margin: 0;
    }

    .content-section {
      margin-top: 32px;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .section-header h2 {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }

    .get-recommendations-btn {
      padding: 8px 16px;
      font-size: 14px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 64px 0;
    }

    .albums-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .album-card {
      position: relative;
      overflow: hidden;
    }

    .album-image {
      position: relative;
      margin-bottom: 16px;
      border-radius: 8px;
      overflow: hidden;
    }

    .album-image img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .album-card:hover .album-image img {
      transform: scale(1.05);
    }

    .play-button {
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 48px;
      height: 48px;
      background-color: #1db954;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      opacity: 0;
      transform: translateY(8px);
      transition: all 0.3s ease;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }

    .album-card:hover .play-button {
      opacity: 1;
      transform: translateY(0);
    }

    .album-info {
      padding: 0 4px;
    }

    .album-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .album-artist {
      font-size: 14px;
      color: #b3b3b3;
      margin: 0 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .album-year {
      font-size: 12px;
      color: #727272;
      margin: 0;
    }

    .recommendations-section,
    .artists-section {
      margin-top: 48px;
    }

    .recommendations-section h2,
    .artists-section h2 {
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
    }

    .artists-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 24px;
    }

    .artist-card {
      text-align: center;
    }

    .artist-image {
      aspect-ratio: 1 / 1;          
      width: 120px;           
      border-radius: 50%;      
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      background: linear-gradient(135deg, #1db954, #1ed760);
    }

    .artist-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1db954, #1ed760);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      color: #000;
    }

    .artist-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;            
      border-radius: 50%;         
    }
    
    .artist-name {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 4px;
      color: #fff;
    }

    .artist-type {
      font-size: 14px;
      color: #b3b3b3;
      margin: 0;
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 0 20px 32px;
      }

      .hero-title {
        font-size: 32px;
      }

      .albums-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 16px;
      }

      .track-item {
        grid-template-columns: 24px 40px 1fr 40px;
        gap: 12px;
      }

      .track-album,
      .track-duration {
        display: none;
      }

      .artists-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 16px;
      }

      .artist-placeholder {
        width: 80px;
        height: 80px;
      }
    }
    
    @media (max-width: 768px) {
      .artist-image {
        width: 90px;
      }
    }

    @media (max-width: 480px) {
      .artist-image {
        width: 70px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  userId: number = 1;
  albums: Album[] = [];
  userArtists: Artist[] = [];
  recommendations: any[] = [];
  isLoading = true;
  showRecommendations = false;
  showPlayer = false;
  playerTracks: Track[] = [];
  playerIndex = 0;
  playerContext = '';

  constructor(
    private musicService: MusicService,
    private router: Router,
    public wishlistService: WishlistService,
    public authService: AuthService,
    public artistSelectionService: ArtistSelectionService
  ) {}

  ngOnInit(): void {
    this.loadNewReleases();
    this.loadUserArtists();
    this.userId = this.authService.getCurrentUser()?.id ?? 0;
  }

  getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  loadNewReleases(): void {
    this.musicService.getNewReleases().subscribe({
      next: (response) => {
        this.albums = response.albums.items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading new releases:', error);
        this.isLoading = false;
      }
    }); 
  }

  loadUserArtists(): void {
    this.musicService.getUserArtists().subscribe({
      next: (artists) => {
        this.userArtists = artists;
        console.log(`Artist Found ${this.userArtists.length} artists`, this.userArtists);
      },
      error: (error) => {
        console.error('Error loading user artists:', error);
      }
    });
  }

  getRecommendations(): void {
    this.musicService.getRecommendations().subscribe({
      next: (response) => {
        // Flatten the recommendations array
        this.recommendations = response.flatMap(item => item.tracks || []);
        this.showRecommendations = true;
      },
      error: (error) => {
        console.error('Error loading recommendations:', error);
      }
    });
  }

  openRecommendation(userId: number) {
    console.log('Opening recommendation component fo user ID:', userId);
    this.router.navigate(['/app/recommendation', userId]);
  }

  openAlbum(albumId: string): void {
    console.log('Opening album with ID:', albumId);
    this.router.navigate(['/app/album', albumId]);
  }

  openArtist(artistId: string): void {
    const artist = this.userArtists.find(a => a.id === artistId);

    if(artist) {
        this.artistSelectionService.setArtist({
        id: artistId,
        image: artist.images?.[0]?.url || ''
      });
    }
    this.router.navigate(['/app/artist', artistId]);
  }

  openTrackPlayer(track: Track, index: number, context: string): void {
    this.playerTracks = this.recommendations;
    this.playerIndex = index;
    this.playerContext = context;
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

  getAlbumImage(album: Album): string {
    return album.images?.[0]?.url || 'https://via.placeholder.com/300x300/1db954/000000?text=♪';
  }

  getTrackImage(track: any): string {
    return track.album?.images?.[2]?.url || 'https://via.placeholder.com/64x64/1db954/000000?text=♪';
  }

  getArtistNames(artists: Artist[]): string {
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

  trackByAlbumId(index: number, album: Album): string {
    return album.id;
  }

  trackByArtistId(index: number, artist: Artist): string {
    return artist.id;
  }

  trackByTrackId(index: number, track: any): string {
    return track.id;
  }
}