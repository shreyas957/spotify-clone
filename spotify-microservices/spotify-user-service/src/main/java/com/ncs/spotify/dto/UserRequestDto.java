package com.ncs.spotify.dto;

import com.ncs.spotify.entity.Gender;

import java.time.LocalDate;

public record UserRequestDto(
        String name,
        String email,
        String password,
        LocalDate dateOfBirth,
        Gender gender,
        String country
) {
}
