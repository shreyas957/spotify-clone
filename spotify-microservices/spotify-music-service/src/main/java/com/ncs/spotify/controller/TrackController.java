package com.ncs.spotify.controller;

import com.ncs.spotify.dto.SpotifyNewReleasesResponse;
import com.ncs.spotify.model.artist.SpotifyArtist;
import com.ncs.spotify.model.search.SpotifySearchResponse;
import com.ncs.spotify.model.track.SpotifyTrack;
import com.ncs.spotify.model.track.SpotifyTracksResponse;
import com.ncs.spotify.service.ArtistService;
import com.ncs.spotify.service.SpotifyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/tracks")
public class TrackController {

    private final SpotifyService spotifyService;
    private final ArtistService artistService;

    public TrackController(SpotifyService spotifyService, ArtistService artistService) {
        this.spotifyService = spotifyService;
        this.artistService = artistService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTrack(@PathVariable String id) {
        Optional<SpotifyTrack> trackByTrackId = spotifyService.getTrackByTrackId(id);

        return ResponseEntity.ok(trackByTrackId);
    }

    @GetMapping
    public ResponseEntity<?> getTracks(
            @RequestParam(required = false) String market,
            @RequestParam List<String> ids
    ) {
        Optional<SpotifyTracksResponse> tracks = spotifyService.getTracks(market, ids.toArray(new String[0]));

        return ResponseEntity.ok(tracks);
    }

    @GetMapping("/artists/{userId}")
    public ResponseEntity<?> getArtists(
            @PathVariable String userId
    ) {
        List<SpotifyArtist> artist = artistService.getUserArtists(Long.parseLong(userId));
        return ResponseEntity.ok(artist);
    }

    @GetMapping("/artists/top-tracks/{artistId}")
    public ResponseEntity<?> getArtistsTopTracks(
            @PathVariable String artistId
    ) {
        SpotifyTracksResponse artistTopTracks = artistService.getArtistTopTracks(artistId);
        return ResponseEntity.ok(artistTopTracks);
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "IN") String market,
            @RequestParam(defaultValue = "15") int limit,
            @RequestParam(defaultValue = "0") int offset
    ) {
        Optional<SpotifySearchResponse> spotifySearchResponse = spotifyService.searchForTracks(query, market, limit, offset);
        return ResponseEntity.ok(spotifySearchResponse);
    }

    @GetMapping("/albums/new-releases")
    public ResponseEntity<?> getNewReleases(@RequestParam(defaultValue = "30") int limit, @RequestParam(defaultValue = "5") int offset) {
        SpotifyNewReleasesResponse newReleasedAlbums = spotifyService.getNewReleasedAlbums(limit, offset);
        return ResponseEntity.ok().body(newReleasedAlbums);
    }

    @GetMapping("/albums/{albumId}/tracks")
    public ResponseEntity<?> getAlbumTracks(
            @PathVariable String albumId,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "5") int offset
    ) {
        SpotifyTracksResponse albumTracks = spotifyService.getAlbumTracks(albumId, limit, offset);
        return ResponseEntity.ok().body(albumTracks);
    }
}

