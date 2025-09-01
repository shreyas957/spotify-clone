package com.ncs.spotify.dto;

import com.ncs.spotify.entity.User;

public class UserMapper {

    public static User toEntity(UserRequestDto dto) {
        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        user.setDateOfBirth(dto.dateOfBirth());
        user.setGender(dto.gender());
        user.setCountry(dto.country());
        return user;
    }

    public static UserResponseDto toResponseDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getDateOfBirth(),
                user.getGender(),
                user.getCountry(),
                user.getCreatedAt()
        );
    }
}
