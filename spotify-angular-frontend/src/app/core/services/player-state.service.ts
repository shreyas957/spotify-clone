// core/services/player-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../models/music.model';

@Injectable({ providedIn: 'root' })
export class PlayerStateService {
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  currentTrack$ = this.currentTrackSubject.asObservable();

  setCurrentTrack(track: Track) {
    this.currentTrackSubject.next(track);
  }
}
