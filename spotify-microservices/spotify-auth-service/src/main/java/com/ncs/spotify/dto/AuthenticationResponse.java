package com.ncs.spotify.dto;

public record AuthenticationResponse(
        String token,
        UserResponseDto userResponseDto
) {
}
