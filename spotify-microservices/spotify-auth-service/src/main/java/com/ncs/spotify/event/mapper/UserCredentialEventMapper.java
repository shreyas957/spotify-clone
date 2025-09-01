package com.ncs.spotify.event.mapper;

import com.ncs.spotify.entity.UserCredential;
import com.ncs.spotify.event.dto.UserCreatedEvent;
import com.ncs.spotify.event.dto.UserDeletedEvent;
import com.ncs.spotify.event.dto.UserUpdatedEvent;

import java.time.LocalDateTime;

public class UserCredentialEventMapper {

    private UserCredentialEventMapper() {
        // Utility class, prevent instantiation
    }

    public static UserCredential fromUserCreatedEvent(UserCreatedEvent event) {
        return new UserCredential(
                event.userId(),
                event.email(),
                event.password(),
                event.createdAt() != null ? event.createdAt() : LocalDateTime.now()
        );
    }

    public static UserCredential fromUserUpdatedEvent(UserUpdatedEvent event) {
        return new UserCredential(
                event.userId(),
                event.email(),
                event.password(),
                event.createdAt() != null ? event.createdAt() : LocalDateTime.now()
        );
    }

    public static UserCredential fromUserDeletedEvent(UserDeletedEvent event) {
        return new UserCredential(
                event.userId(),
                event.email(),
                null, // No password for deleted user
                event.createdAt() != null ? event.createdAt() : LocalDateTime.now()
        );
    }
}
