package com.ncs.spotify.service;

import com.ncs.spotify.model.artist.SpotifyArtist;
import com.ncs.spotify.model.track.SpotifyTracksResponse;
import com.ncs.spotify.repository.UserArtistPrefRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArtistService {

    private final UserArtistPrefRepository artistRepo;
    private final SpotifyService spotifyService;

    public List<SpotifyArtist> getUserArtists(Long userId) {
        List<String> artistIds = artistRepo.findByUserId(userId)
                .stream()
                .map(a -> a.getId().getArtistId())
                .toList();

        List<SpotifyArtist> artists = new ArrayList<>();
        for (String id : artistIds) {
            spotifyService.getArtist(id).ifPresent(artists::add);
        }
        return artists;
    }

    public SpotifyTracksResponse getArtistTopTracks(String artistId) {
        Optional<SpotifyTracksResponse> artistsTopTracks = spotifyService.getArtistsTopTracks(artistId);
        return artistsTopTracks.get();
    }
}
