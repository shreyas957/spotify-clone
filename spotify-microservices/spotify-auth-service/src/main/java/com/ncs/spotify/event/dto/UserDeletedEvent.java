package com.ncs.spotify.event.dto;

import java.time.LocalDateTime;

public record UserDeletedEvent(
        Long userId,
        String email,
        LocalDateTime createdAt
) {
}
