package com.ncs.spotify.event.dto;

import java.time.LocalDateTime;

public record UserUpdatedEvent(
        Long userId,
        String email,
        String password,
        LocalDateTime createdAt
) {
}
