package com.ncs.spotify.model.track;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ncs.spotify.model.album.SpotifyAlbum;
import com.ncs.spotify.model.artist.SpotifyArtist;
import com.ncs.spotify.model.general.SpotifyLinkedFrom;
import com.ncs.spotify.model.general.SpotifyRestriction;
import lombok.Data;

import java.util.List;
import java.util.Map;
import java.util.Objects;

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

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        SpotifyTrack that = (SpotifyTrack) o;
        return discNumber == that.discNumber && durationMs == that.durationMs && explicit == that.explicit && isPlayable == that.isPlayable && popularity == that.popularity && trackNumber == that.trackNumber && isLocal == that.isLocal && Objects.equals(album, that.album) && Objects.equals(artists, that.artists) && Objects.equals(availableMarkets, that.availableMarkets) && Objects.equals(externalIds, that.externalIds) && Objects.equals(externalUrls, that.externalUrls) && Objects.equals(href, that.href) && Objects.equals(id, that.id) && Objects.equals(linkedFrom, that.linkedFrom) && Objects.equals(restrictions, that.restrictions) && Objects.equals(name, that.name) && Objects.equals(previewUrl, that.previewUrl) && Objects.equals(type, that.type) && Objects.equals(uri, that.uri);
    }

    @Override
    public int hashCode() {
        return Objects.hash(album, artists, availableMarkets, discNumber, durationMs, explicit, externalIds, externalUrls, href, id, isPlayable, linkedFrom, restrictions, name, popularity, previewUrl, trackNumber, type, uri, isLocal);
    }
}
