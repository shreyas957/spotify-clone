import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TrackPlayedEvent } from '../models/music.model';
import { TrackLikedEvent } from '../models/music.model';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  constructor(private http: HttpClient) {}

  trackPlayed(event: TrackPlayedEvent): Observable<void> {
    return this.http.post<void>(`${environment.musicApiUrl}/recommendation/played`, event);
  }

  trackLiked(event: TrackLikedEvent): Observable<void> {
    return this.http.post<void>(`${environment.musicApiUrl}/recommendation/liked`, event);
  }
}
