package com.ncs.spotify.model.artist;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ncs.spotify.model.general.SpotifyImage;
import lombok.Data;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Data
public class SpotifyArtist {
    @JsonProperty("external_urls")
    private Map<String, String> externalUrls;

    private String href;
    private String id;
    private String name;
    private String type;
    private String uri;

    private List<String> genres;   // optional, but useful
    private List<SpotifyImage> images; // artist profile picture

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        SpotifyArtist that = (SpotifyArtist) o;
        return Objects.equals(externalUrls, that.externalUrls) && Objects.equals(href, that.href) && Objects.equals(id, that.id) && Objects.equals(name, that.name) && Objects.equals(type, that.type) && Objects.equals(uri, that.uri) && Objects.equals(genres, that.genres) && Objects.equals(images, that.images);
    }

    @Override
    public int hashCode() {
        return Objects.hash(externalUrls, href, id, name, type, uri, genres, images);
    }
}
