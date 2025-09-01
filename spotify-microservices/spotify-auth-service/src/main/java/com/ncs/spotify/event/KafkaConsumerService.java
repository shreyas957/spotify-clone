package com.ncs.spotify.event;

import com.ncs.spotify.entity.UserCredential;
import com.ncs.spotify.event.dto.UserCreatedEvent;
import com.ncs.spotify.event.dto.UserDeletedEvent;
import com.ncs.spotify.event.dto.UserUpdatedEvent;
import com.ncs.spotify.event.mapper.UserCredentialEventMapper;
import com.ncs.spotify.service.UserCredentialsService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

/**
 * Kafka consumer service that listens to multiple user-related events from different topics.
 * <p>
 * Each listener method is bound to its own topic, group ID, and container factory
 * to ensure proper deserialization and independent offset management.
 */
@Service
@Transactional
public class KafkaConsumerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);
    private final UserCredentialsService userCredentialsService;

    public KafkaConsumerService(UserCredentialsService userCredentialsService) {
        this.userCredentialsService = userCredentialsService;
    }

    @KafkaListener(
            topics = "${spring.kafka.topics.user-created}",
            groupId = "${spring.kafka.groups.user-created}",
            containerFactory = "userCreatedFactory"
    )
    public void consumeUserCreated(UserCreatedEvent event) {
        logger.info("Received UserCreatedEvent: {}", event);
        userCredentialsService.insertUserCredentialsViaKafka(UserCredentialEventMapper.fromUserCreatedEvent(event));
    }

    @KafkaListener(
            topics = "${spring.kafka.topics.user-updated}",
            groupId = "${spring.kafka.groups.user-updated}",
            containerFactory = "userUpdatedFactory"
    )
    public void consumeUserUpdated(UserUpdatedEvent event) {
        logger.info("Received UserUpdatedEvent: {}", event);
        UserCredential userCred = userCredentialsService.findUserCredentialsByUserId(event.userId());
        UserCredential update = UserCredentialEventMapper.fromUserUpdatedEvent(event);
        update.setId(userCred.getId());
        userCredentialsService.updateUserCredentials(update);
    }

    @KafkaListener(
            topics = "${spring.kafka.topics.user-deleted}",
            groupId = "${spring.kafka.groups.user-deleted}",
            containerFactory = "userDeletedFactory"
    )
    public void consumeUserDeleted(UserDeletedEvent event) {
        logger.info("Received UserDeletedEvent: {}", event);
        userCredentialsService.deleteUserCredByEmail(event.email());
    }
}
