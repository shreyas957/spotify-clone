package com.ncs.spotify.controller;

import com.ncs.spotify.kafka.PreferenceEventProducer;
import com.ncs.spotify.kafka.TrackLikedEvent;
import com.ncs.spotify.kafka.TrackPlayedEvent;
import com.ncs.spotify.service.recommndation.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/recommendation")
@RequiredArgsConstructor
public class UserPreferencesController {
    private final Logger logger = LoggerFactory.getLogger(UserPreferencesController.class);
    private final RecommendationService recommendationService;
    private final PreferenceEventProducer producer;

    @PostMapping("/played")
    public void trackPlayed(@RequestBody TrackPlayedEvent event) {
        producer.sendTrackPlayed(event);
    }

    @PostMapping("/liked")
    public void trackLiked(@RequestBody TrackLikedEvent event) {
        producer.sendTrackLiked(event);
    }

    @GetMapping
    public ResponseEntity<?> getRecommendations(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "IN") String market
    ) {
        logger.info("Getting recommendations for userId: {}", userId);
        var recs = recommendationService.getRecommendations(userId, limit, market);
        return ResponseEntity.ok(recs);
    }
}
