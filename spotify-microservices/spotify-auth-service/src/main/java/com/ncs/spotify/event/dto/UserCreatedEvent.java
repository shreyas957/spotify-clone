package com.ncs.spotify.event.dto;

import java.time.LocalDateTime;

public record UserCreatedEvent(
        Long userId,
        String email,
        String password,
        LocalDateTime createdAt
) {
}
