package com.ncs.spotify.dto;

import lombok.Data;

import java.util.List;

@Data
public class SpotifyAlbumTracksResponse {
    private List<SpotifyTrackIdOnly> items;
    private int total;
    private String href;
    private int limit;
    private int offset;
    private String next;
    private String previous;

    @Data
    public static class SpotifyTrackIdOnly {
        private String id;
    }
}


