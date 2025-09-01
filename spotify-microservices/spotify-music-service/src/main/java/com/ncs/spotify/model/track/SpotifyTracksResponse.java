package com.ncs.spotify.model.track;

import lombok.Data;

import java.util.List;

@Data
public class SpotifyTracksResponse {
    private List<SpotifyTrack> tracks;
}
