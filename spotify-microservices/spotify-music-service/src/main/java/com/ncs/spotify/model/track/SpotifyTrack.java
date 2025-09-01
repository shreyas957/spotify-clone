package com.ncs.spotify.model.track;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ncs.spotify.model.general.SpotifyLinkedFrom;
import com.ncs.spotify.model.general.SpotifyRestriction;
import com.ncs.spotify.model.album.SpotifyAlbum;
import com.ncs.spotify.model.artist.SpotifyArtist;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class SpotifyTrack {
    private SpotifyAlbum album;
    private List<SpotifyArtist> artists;

    @JsonProperty("available_markets")
    private List<String> availableMarkets;

    @JsonProperty("disc_number")
    private int discNumber;

    @JsonProperty("duration_ms")
    private int durationMs;

    private boolean explicit;

    @JsonProperty("external_ids")
    private Map<String, String> externalIds;

    @JsonProperty("external_urls")
    private Map<String, String> externalUrls;

    private String href;
    private String id;

    @JsonProperty("is_playable")
    private boolean isPlayable;

    private SpotifyLinkedFrom linkedFrom;
    private SpotifyRestriction restrictions;

    private String name;
    private int popularity;

    @JsonProperty("preview_url")
    private String previewUrl;

    @JsonProperty("track_number")
    private int trackNumber;

    private String type;
    private String uri;

    @JsonProperty("is_local")
    private boolean isLocal;
}
