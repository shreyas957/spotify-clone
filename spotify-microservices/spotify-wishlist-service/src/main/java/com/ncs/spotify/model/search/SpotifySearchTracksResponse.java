package com.ncs.spotify.model.search;

import com.ncs.spotify.model.track.SpotifyTrack;
import lombok.Data;

import java.util.List;

@Data
public class SpotifySearchTracksResponse {
    private String href;
    private List<SpotifyTrack> items;
    private int limit;
    private String next;
    private int offset;
    private String previous;
    private int total;
}
