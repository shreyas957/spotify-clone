package com.ncs.spotify.event.mapper;

import com.ncs.spotify.entity.User;
import com.ncs.spotify.event.dto.UserCreatedEvent;
import com.ncs.spotify.event.dto.UserDeletedEvent;
import com.ncs.spotify.event.dto.UserUpdatedEvent;

public class UserEventMapper {

    private UserEventMapper() {
        // Utility class, prevent instantiation
    }

    public static UserCreatedEvent toUserCreatedEvent(User user) {
        return new UserCreatedEvent(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getCreatedAt()
        );
    }

    public static UserDeletedEvent toUserDeletedEvent(User user) {
        return new UserDeletedEvent(
                user.getId(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }

    public static UserUpdatedEvent toUserUpdatedEvent(User user) {
        return new UserUpdatedEvent(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getCreatedAt()
        );
    }
}
