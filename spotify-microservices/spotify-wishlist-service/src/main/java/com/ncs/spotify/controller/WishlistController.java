package com.ncs.spotify.controller;

import com.ncs.spotify.entity.Wishlist;
import com.ncs.spotify.model.track.SpotifyTrack;
import com.ncs.spotify.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/{userId}/add/{trackId}")
    public Wishlist addToWishlist(@PathVariable Long userId, @PathVariable String trackId) {
        return wishlistService.addToWishlist(userId, trackId);
    }

    @GetMapping("/{userId}")
    public List<SpotifyTrack> getWishlistTracks(@PathVariable Long userId) {
        return wishlistService.getWishlistTracks(userId);
    }

    @DeleteMapping("/{userId}/remove/{trackId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long userId, @PathVariable String trackId) {
        wishlistService.removeWishlist(userId, trackId);
        return ResponseEntity.ok().build();
    }
}
