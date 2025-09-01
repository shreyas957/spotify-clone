package com.ncs.spotify.model.album;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ncs.spotify.model.artist.SpotifyArtist;
import com.ncs.spotify.model.general.SpotifyImage;
import com.ncs.spotify.model.general.SpotifyRestriction;
import lombok.Data;

import java.util.List;
import java.util.Map;
import java.util.Objects;

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

    private SpotifyRestriction restrictions;
    private String type;
    private String uri;

    private List<SpotifyArtist> artists;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        SpotifyAlbum that = (SpotifyAlbum) o;
        return totalTracks == that.totalTracks && Objects.equals(albumType, that.albumType) && Objects.equals(availableMarkets, that.availableMarkets) && Objects.equals(externalUrls, that.externalUrls) && Objects.equals(href, that.href) && Objects.equals(id, that.id) && Objects.equals(images, that.images) && Objects.equals(name, that.name) && Objects.equals(releaseDate, that.releaseDate) && Objects.equals(releaseDatePrecision, that.releaseDatePrecision) && Objects.equals(restrictions, that.restrictions) && Objects.equals(type, that.type) && Objects.equals(uri, that.uri) && Objects.equals(artists, that.artists);
    }

    @Override
    public int hashCode() {
        return Objects.hash(albumType, totalTracks, availableMarkets, externalUrls, href, id, images, name, releaseDate, releaseDatePrecision, restrictions, type, uri, artists);
    }
}