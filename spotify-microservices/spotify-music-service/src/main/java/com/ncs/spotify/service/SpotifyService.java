package com.ncs.spotify.service;

import com.ncs.spotify.dto.SpotifyAlbumTracksResponse;
import com.ncs.spotify.dto.SpotifyNewReleasesResponse;
import com.ncs.spotify.exception.NoTrackPresentException;
import com.ncs.spotify.model.artist.SpotifyArtist;
import com.ncs.spotify.model.search.SpotifySearchResponse;
import com.ncs.spotify.model.track.SpotifyTrack;
import com.ncs.spotify.model.track.SpotifyTracksResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Optional;

@Configuration
public class SpotifyService {
    private final WebClient webClient;
    private final SpotifyAuthService spotifyAuthService;

    public SpotifyService(@Qualifier("api-web-client") WebClient webClient, SpotifyAuthService spotifyAuthService) {
        this.webClient = webClient;
        this.spotifyAuthService = spotifyAuthService;
    }

    public Optional<SpotifyTrack> getTrackByTrackId(String trackId) {
        String accessToken = spotifyAuthService.getAccessToken();

        SpotifyTrack track = webClient.get()
                .uri("/tracks/{id}", trackId)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(SpotifyTrack.class)
                .block();
        return Optional.ofNullable(track);
    }

    public Optional<SpotifyTracksResponse> getTracks(String market, String... trackIds) {
        String accessToken = spotifyAuthService.getAccessToken();
        String ids = String.join(",", trackIds);

        SpotifyTracksResponse response = webClient.get()
                .uri(uriBuilder ->
                        uriBuilder.path("/tracks")
                                .queryParam("ids", ids)
                                .queryParam("market", market == null ? "IN" : market)
                                .build()
                )
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(SpotifyTracksResponse.class)
                .block();

        return Optional.ofNullable(response);
    }

    public Optional<SpotifyTracksResponse> getArtistsTopTracks(String artistId) {
        String accessToken = spotifyAuthService.getAccessToken();
        SpotifyTracksResponse response = webClient.get()
                .uri("/artists/{artistId}/top-tracks", artistId)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(SpotifyTracksResponse.class)
                .block();

        return Optional.ofNullable(response);
    }

    public Optional<SpotifySearchResponse> searchForTracks(String query, String market, int limit, int offset) {
        String accessToken = spotifyAuthService.getAccessToken();
        SpotifySearchResponse response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("q", query)
                        .queryParam("type", "track")
                        .queryParam("market", market)
                        .queryParam("limit", limit)
                        .queryParam("offset", offset)
                        .build())
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(SpotifySearchResponse.class)
                .block();

        return Optional.ofNullable(response);
    }

    public Optional<SpotifyArtist> getArtist(String artistId) {
        String token = spotifyAuthService.getAccessToken();

        SpotifyArtist artist = webClient.get()
                .uri("/artists/{id}", artistId)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(SpotifyArtist.class)
                .block();
        return Optional.ofNullable(artist);
    }

    public SpotifyNewReleasesResponse getNewReleasedAlbums(int limit, int offset) {
        String accessToken = spotifyAuthService.getAccessToken();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/browse/new-releases")
                        .queryParam("limit", limit)
                        .queryParam("offset", offset)
                        .build())
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(SpotifyNewReleasesResponse.class)
                .block();
    }

    public SpotifyTracksResponse getAlbumTracks(String albumId, int limit, int offset) {
        String accessToken = spotifyAuthService.getAccessToken();

        SpotifyAlbumTracksResponse albumTracksResponse = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/albums/{id}/tracks")
//                        .queryParam("limit", limit)
//                        .queryParam("offset", offset)
                        .build(albumId))
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(SpotifyAlbumTracksResponse.class)
                .block();

        if (albumTracksResponse == null || albumTracksResponse.getItems() == null || albumTracksResponse.getItems().isEmpty()) {
            throw new NoTrackPresentException("The album does not contain any tracks");
        }

        List<String> trackIds = albumTracksResponse.getItems()
                .stream()
                .map(SpotifyAlbumTracksResponse.SpotifyTrackIdOnly::getId)
                .toList();

        String[] idsArray = trackIds.toArray(new String[0]);

        Optional<SpotifyTracksResponse> tracks = getTracks("IN", idsArray);

        if (tracks.isEmpty()) {
            throw new NoTrackPresentException("The album does not contain any tracks");
        }
        return tracks.get();
    }
}
