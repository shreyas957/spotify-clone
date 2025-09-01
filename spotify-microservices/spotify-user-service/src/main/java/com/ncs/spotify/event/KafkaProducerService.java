package com.ncs.spotify.event;

import com.ncs.spotify.event.dto.UserCreatedEvent;
import com.ncs.spotify.event.dto.UserDeletedEvent;
import com.ncs.spotify.event.dto.UserUpdatedEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    @Value("${spring.kafka.topics.user-created}")
    private String userCreatedTopic;

    @Value("${spring.kafka.topics.user-deleted}")
    private String userDeletedTopic;

    @Value("${spring.kafka.topics.user-updated}")
    private String userUpdatedTopic;

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendUserCreated(UserCreatedEvent event) {
        kafkaTemplate.send(userCreatedTopic, event.userId().toString(), event);
    }

    public void sendUserDeleted(UserDeletedEvent event) {
        kafkaTemplate.send(userDeletedTopic, event.userId().toString(), event);
    }

    public void sendUserUpdated(UserUpdatedEvent event) {
        kafkaTemplate.send(userUpdatedTopic, event.userId().toString(), event);
    }
}
