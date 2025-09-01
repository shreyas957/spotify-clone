export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Artist {
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
  genres?: string[] | null;
  images?: Image[] | null;
  external_urls: ExternalUrls;
}

export interface Album {
  href: string;
  id: string;
  images: Image[];
  name: string;
  type: string;
  uri: string;
  artists: AlbumArtist[];
  album_type: string;
  total_tracks: number;
  available_markets: string[] | null;
  external_urls: ExternalUrls;
  release_date: string;
  release_date_precision: string;
}

export interface AlbumArtist {
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
  externalUrls: ExternalUrls
}

export interface Track {
  album: Album;
  artists: Artist[];
  explicit: boolean;
  href: string;
  id: string;
  linkedFrom?: any;
  restrictions?: any;
  name: string;
  popularity: number;
  type: string;
  uri: string;
  available_markets: string[] | null;
  disc_number: number;
  duration_ms: number;
  external_ids: {
    isrc: string;
  };
  external_urls: ExternalUrls;
  is_playable: boolean;
  preview_url?: string | null;
  track_number: number;
  is_local: boolean;
}

export interface SearchResponse {
  tracks: {
    href: string;
    items: Track[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

export interface NewReleasesResponse {
  albums: {
    href: string;
    limit: number;
    offset: number;
    total: number;
    next: string | null;
    previous: string | null;
    items: Album[];
  };
}

export interface ArtistTopTracksResponse {
  tracks: Track[];
}

export interface RecommendationResponse {
  tracks: Track[];
}

export interface TrackPlayedEvent {
  userId: number;
  trackId: string;
  trackName: string;
  artistIds: string[];
  genres: string[];
  msPlayed: number;
  playedAt: string;   // use ISO string for Instant
}

export interface TrackLikedEvent {
  userId: number;
  trackId: string;
  liked: boolean;
  likedAt: string;   // use ISO string for Instant
}