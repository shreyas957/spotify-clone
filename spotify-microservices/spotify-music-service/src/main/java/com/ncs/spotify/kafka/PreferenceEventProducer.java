package com.ncs.spotify.kafka;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PreferenceEventProducer {
    @Value("${spring.kafka.topics.track-played}")
    private String trackPlayedTopic;

    @Value("${spring.kafka.topics.track-liked}")
    private String trackLikedTopic;

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendTrackPlayed(TrackPlayedEvent event) {
        kafkaTemplate.send(trackPlayedTopic, event.getUserId().toString(), event);
    }

    public void sendTrackLiked(TrackLikedEvent event) {
        kafkaTemplate.send(trackLikedTopic, event.getUserId().toString(), event);
    }
}
