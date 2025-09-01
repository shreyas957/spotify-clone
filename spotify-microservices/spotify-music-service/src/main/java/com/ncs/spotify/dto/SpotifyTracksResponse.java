package com.ncs.spotify.dto;

import com.ncs.spotify.model.track.SpotifyTrack;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpotifyTracksResponse {
    private List<SpotifyTrack> tracks;
}
