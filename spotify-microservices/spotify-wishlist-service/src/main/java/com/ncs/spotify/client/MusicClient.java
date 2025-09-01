package com.ncs.spotify.client;

import com.ncs.spotify.model.track.SpotifyTrack;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "SPOTIFY-WISHLIST-SERVICE", url = "${MUSIC_SERVICE_HOST}")
public interface MusicClient {
    @GetMapping("/api/v1/tracks/{id}")
    SpotifyTrack getTrackById(@PathVariable("id") String id);
}
