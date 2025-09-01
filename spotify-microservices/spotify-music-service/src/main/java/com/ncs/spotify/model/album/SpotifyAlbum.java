package com.ncs.spotify.model.album;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ncs.spotify.model.general.SpotifyImage;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class SpotifyAlbum {
    @JsonProperty("album_type")
    private String albumType;

    @JsonProperty("total_tracks")
    private int totalTracks;

    @JsonProperty("available_markets")
    private List<String> availableMarkets;

    @JsonProperty("external_urls")
    private Map<String, String> externalUrls;

    private String href;
    private String id;
    private List<SpotifyImage> images;
    private String name;

    @JsonProperty("release_date")
    private String releaseDate;

    @JsonProperty("release_date_precision")
    private String releaseDatePrecision;

    private String type;
    private String uri;

    private List<SpotifyArtist> artists;

    @Data
    static class SpotifyArtist {
        @JsonProperty("external_urls")
        private Map<String, String> externalUrls;

        private String href;
        private String id;
        private String name;
        private String type;
        private String uri;
    }
}