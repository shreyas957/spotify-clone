package com.ncs.spotify.kafka;

import com.ncs.spotify.service.recommndation.PreferenceService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@EnableKafka
public class PreferenceEventConsumer {
    private static final Logger logger = LoggerFactory.getLogger(PreferenceEventConsumer.class);
    private final PreferenceService preferenceService;

    @KafkaListener(topics = "${spring.kafka.topics.track-played}", groupId = "${spring.kafka.groups.track-played-group}")
    public void consumeTrackPlayed(TrackPlayedEvent event) {
        logger.info("Received track played event: {}", event);
        preferenceService.handleTrackPlayed(event);
    }

    @KafkaListener(topics = "${spring.kafka.topics.track-liked}", groupId = "${spring.kafka.groups.track-liked-group}")
    public void consumeTrackLiked(TrackLikedEvent event) {
        logger.info("Received track liked event: {}", event);
        preferenceService.handleTrackLiked(event);
    }
}
