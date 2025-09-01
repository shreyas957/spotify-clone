package com.ncs.spotify.service.recommndation;

import com.ncs.spotify.model.track.SpotifyTrack;
import com.ncs.spotify.model.track.SpotifyTracksResponse;
import com.ncs.spotify.repository.UserArtistPrefRepository;
import com.ncs.spotify.repository.UserGenrePrefRepository;
import com.ncs.spotify.repository.UserTrackPrefRepository;
import com.ncs.spotify.service.SpotifyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UserTrackPrefRepository trackRepo;
    private final UserArtistPrefRepository artistRepo;
    private final UserGenrePrefRepository genreRepo;
    private final SpotifyService spotifyService;

    public SpotifyTracksResponse getRecommendations(Long userId, int limit, String market) {
        List<String> seedTracks = trackRepo.findTopByUserId(userId, Pageable.ofSize(10))
                .stream()
                .map(t -> t.getId().getTrackId())
                .toList();

        List<String> seedArtists = artistRepo.findTop20ByIdUserIdOrderByScoreDesc(userId)
                .stream()
                .map(a -> a.getId().getArtistId())
                .toList();

        List<String> seedGenres = genreRepo.findTop20ByIdUserIdOrderByScoreDesc(userId)
                .stream()
                .map(g -> g.getId().getGenre())
                .toList();

        List<SpotifyTrack> recommendedTracks = new ArrayList<>();

        for (var artist : seedArtists) {
            Optional<SpotifyTracksResponse> artistsTopTracks = spotifyService.getArtistsTopTracks(artist);
            artistsTopTracks.ifPresent(resp -> recommendedTracks.addAll(resp.getTracks()));
        }

        // Fetch Spotify details only for track seeds
        Optional<SpotifyTracksResponse> tracksOpt =
                spotifyService.getTracks(market, seedTracks.toArray(new String[0]));
        tracksOpt.ifPresent(resp -> recommendedTracks.addAll(resp.getTracks()));

        SpotifyTracksResponse spotifyTracksResponse = new SpotifyTracksResponse();
        spotifyTracksResponse.setTracks(recommendedTracks);
        return spotifyTracksResponse;
    }
}
