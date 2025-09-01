package com.ncs.spotify.repository;

import com.ncs.spotify.entity.Wishlist;
import com.ncs.spotify.model.TrackIdOnly;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface WishlistRepository extends MongoRepository<Wishlist, Long> {

    List<Wishlist> findByUserId(Long userId);

    boolean existsByUserIdAndTrackId(Long userId, String trackId);

    /**
     * Projection interface for fetching only the {@code trackId} field from Wishlist documents.
     * <p>
     * Without this, Spring Data returns JSON strings like:
     * {@code {"trackId":"3AJwUDP919kvQ9QcozQPxg"}}
     * <br>
     * With this projection, Spring Data maps the filed to interface method & we can directly call {@code getTrackId()} to get:
     * {@code "3AJwUDP919kvQ9QcozQPxg"}.
     */
    @Query(value = "{ 'userId': ?0 }", fields = "{ 'trackId': 1, '_id': 0 }")
    List<TrackIdOnly> findOnlyTrackIdsByUserId(Long userId);

    void deleteWishlistByUserIdAndTrackId(Long userId, String trackId);
}
