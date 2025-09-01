package com.ncs.spotify.model.artist;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ncs.spotify.model.general.SpotifyImage;
import lombok.Data;

import java.util.List;
import java.util.Map;

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
}
