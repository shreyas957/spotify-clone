import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistSelectionService {
  private artistSource = new BehaviorSubject<{ id: string; image: string } | null>(null);

  // Observable that components can subscribe to
  selectedArtist$ = this.artistSource.asObservable();

  // Method to update artist selection
  setArtist(artist: { id: string; image: string }) {
    this.artistSource.next(artist);
  }
}
