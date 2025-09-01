import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Track } from '../models/music.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<Track[]>([]);
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadWishlist();
  }

  getWishlist(): Observable<Track[]> {
    const userId = this.authService.getCurrentUser()?.id;
    return this.http.get<Track[]>(`${environment.wishlistApiUrl}/wishlist/${userId}`);
  }

  addToWishlist(trackId: string): Observable<any> {
    const userId = this.authService.getCurrentUser()?.id;
    return this.http.post(`${environment.wishlistApiUrl}/wishlist/${userId}/add/${trackId}`, {})
      .pipe(
        // Update local state immediately
        tap(() => {
          const current = this.wishlistSubject.value;
          if (!current.some(t => t.id === trackId)) {
            this.wishlistSubject.next([...current, { id: trackId } as Track]); // minimal Track object
          }
        })
      );
  }

  removeFromWishlist(trackId: string): Observable<any> {
  const userId = this.authService.getCurrentUser()?.id;

  return this.http.delete(`${environment.wishlistApiUrl}/wishlist/${userId}/remove/${trackId}`).pipe(
    tap(() => {
      const updated = this.wishlistSubject.value.filter(track => track.id !== trackId);
      this.wishlistSubject.next(updated);
    })
  );
}

  isInWishlist(trackId: string): boolean {
    return this.wishlistSubject.value.some(track => track.id === trackId);
  }

  private loadWishlist(): void {
    if (this.authService.isAuthenticated()) {
      this.getWishlist().subscribe(tracks => {
        this.wishlistSubject.next(tracks);
      });
    }
  }

  refreshWishlist(): void {
    this.loadWishlist();
  }
}