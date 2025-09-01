import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { 
  Track, 
  Artist, 
  Album, 
  SearchResponse, 
  NewReleasesResponse, 
  ArtistTopTracksResponse,
  RecommendationResponse
} from '../models/music.model';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getNewReleases(): Observable<NewReleasesResponse> {
    return this.http.get<NewReleasesResponse>(`${environment.musicApiUrl}/tracks/albums/new-releases`);
  }

  getAlbumTracks(albumId: string): Observable<Track[]> {
    return this.http
    .get<{ tracks: Track[] }>(`${environment.musicApiUrl}/tracks/albums/${albumId}/tracks`)
    .pipe(
      map(res => res.tracks)
    );
  }

  getUserArtists(): Observable<Artist[]> {
    const userId = this.authService.getCurrentUser()?.id;
    return this.http.get<Artist[]>(`${environment.musicApiUrl}/tracks/artists/${userId}`);
  }

  getArtistTopTracks(artistId: string): Observable<ArtistTopTracksResponse> {
    return this.http.get<ArtistTopTracksResponse>(`${environment.musicApiUrl}/tracks/artists/top-tracks/${artistId}`);
  }

  searchTracks(query: string): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(`${environment.musicApiUrl}/tracks/search?query=${encodeURIComponent(query)}`);
  }

  getRecommendations(): Observable<RecommendationResponse[]> {
    return this.http.get<RecommendationResponse[]>(`${environment.musicApiUrl}/recommendation`);
  }

  getRecommendationsForUser(userId: number): Observable<RecommendationResponse> {
    return this.http.get<RecommendationResponse>(`${environment.musicApiUrl}/recommendation`,{ 
      params: { userId: userId } 
    }
  );
}

  getTrack(trackId: string): Observable<Track> {
    return this.http.get<Track>(`${environment.musicApiUrl}/tracks/${trackId}`);
  }
  
}