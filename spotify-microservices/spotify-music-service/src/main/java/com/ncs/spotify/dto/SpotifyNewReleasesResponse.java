package com.ncs.spotify.dto;

import com.ncs.spotify.model.album.SpotifyAlbum;
import lombok.Data;

import java.util.List;

@Data
public class SpotifyNewReleasesResponse {
    private Albums albums;

    @Data
    public static class Albums {
        private String href;
        private int limit;
        private int offset;
        private int total;
        private String next;
        private String previous;
        private List<SpotifyAlbum> items; // each item is your SpotifyAlbum
    }
}