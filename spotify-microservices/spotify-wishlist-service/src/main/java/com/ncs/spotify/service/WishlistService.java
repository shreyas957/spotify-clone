package com.ncs.spotify.service;

import com.ncs.spotify.client.MusicClient;
import com.ncs.spotify.entity.Wishlist;
import com.ncs.spotify.exception.WishlistAlreadyExistsException;
import com.ncs.spotify.model.TrackIdOnly;
import com.ncs.spotify.model.track.SpotifyTrack;
import com.ncs.spotify.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final MusicClient musicClient; // your existing service to call Spotify API
    private final RedisService redisService;

    private static final Logger logger = LoggerFactory.getLogger(WishlistService.class);

    public Wishlist addToWishlist(Long userId, String trackId) {
        if (wishlistRepository.existsByUserIdAndTrackId(userId, trackId)) {
            throw new WishlistAlreadyExistsException("Track already added to wishlist for user " + userId);
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUserId(userId);
        wishlist.setTrackId(trackId);
        logger.info("Adding new wishlist for user {} to track {}", userId, trackId);
        return wishlistRepository.save(wishlist);
    }

    public List<Wishlist> getWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    @Transactional
    public List<SpotifyTrack> getWishlistTracks(Long userId) {
        List<String> trackIds = wishlistRepository.findOnlyTrackIdsByUserId(userId)
                .stream()
                .map(TrackIdOnly::getTrackId)
                .toList();

        logger.info("Tracks for user {} from Wishlist repository are {}", userId, trackIds);

        return trackIds.stream()
                .map(this::getTrackDetails) // will check cache before Spotify API
                .collect(Collectors.toList());
    }

    public SpotifyTrack getTrackDetails(String trackId) {

        // check cache
        SpotifyTrack spotifyTrack = redisService.get(trackId);
        if (spotifyTrack != null) {
            logger.info("Cache HIT -> Fetching track from Redis for track id={}", trackId);
            return spotifyTrack;
        }
        // else
        logger.info("Cache MISS -> Fetching track from Spotify for track id={}", trackId);

        // set cache for next time
        SpotifyTrack trackById = musicClient.getTrackById(trackId);
        if (trackById != null) {
            redisService.set(trackId, trackById, 1L);
        }
        return trackById;
    }

    public void removeWishlist(Long userId, String trackId) {
        // check if present then delete
        boolean existsByUserIdAndTrackId = wishlistRepository.existsByUserIdAndTrackId(userId, trackId);

        if (!existsByUserIdAndTrackId) {
            throw new IllegalArgumentException(String.format("Track id %s not found for user %s", trackId, userId));
        }

        wishlistRepository.deleteWishlistByUserIdAndTrackId(userId, trackId);
    }
}
