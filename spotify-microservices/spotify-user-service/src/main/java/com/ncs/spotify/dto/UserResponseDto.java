package com.ncs.spotify.dto;

import com.ncs.spotify.entity.Gender;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserResponseDto(
        Long id,
        String name,
        String email,
        LocalDate dateOfBirth,
        Gender gender,
        String country,
        LocalDateTime createdAt
) {
}
