package com.ncs.spotify.service;

import com.ncs.spotify.dto.UserRequestDto;
import com.ncs.spotify.dto.UserResponseDto;
import com.ncs.spotify.entity.User;
import com.ncs.spotify.event.KafkaProducerService;
import com.ncs.spotify.event.mapper.UserEventMapper;
import com.ncs.spotify.exception.UserAlreadyExistsException;
import com.ncs.spotify.exception.UserNotFoundException;
import com.ncs.spotify.dto.UserMapper;
import com.ncs.spotify.repository.UserDao;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserDao userDao;
    private final BCryptPasswordEncoder passwordEncoder;
    private final KafkaProducerService kafkaProducerService;

    public UserService(UserDao userDao, BCryptPasswordEncoder passwordEncoder, KafkaProducerService kafkaProducerService) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
        this.kafkaProducerService = kafkaProducerService;
    }

    public UserResponseDto createUser(UserRequestDto request) {
        if (userDao.existsUserByEmail(request.email())) {
            throw new UserAlreadyExistsException("Email already in use: " + request.email());
        }
        User user = UserMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setCreatedAt(LocalDateTime.now());
        userDao.insertUser(user);
        return UserMapper.toResponseDto(user);
    }

    public UserResponseDto updateUser(Long id, UserRequestDto request) {
        // 1. Fetch existing user
        User existing = userDao.findUserById(id)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + id + " not found."));

        boolean isEmailChanged = !existing.getEmail().equals(request.email());
        boolean isPasswordChanged = !passwordEncoder.matches(request.password(), existing.getPassword());

        // 2. If email changed, check uniqueness
        if (isEmailChanged && userDao.existsUserByEmail(request.email())) {
            throw new IllegalArgumentException("Email already in use by another user.");
        }

        // 3. Update fields
        existing.setName(request.name());
        existing.setEmail(request.email());
        existing.setPassword(passwordEncoder.encode(request.password()));
        existing.setDateOfBirth(request.dateOfBirth());
        existing.setGender(request.gender());
        existing.setCountry(request.country());

        // 4. Send event only if email or password changed
        if (isEmailChanged || isPasswordChanged) {
            kafkaProducerService.sendUserUpdated(UserEventMapper.toUserUpdatedEvent(existing));
        }

        // 5. Save update
        userDao.updateUser(existing);

        return UserMapper.toResponseDto(existing);
    }


    public UserResponseDto getUserById(Long id) {
        return userDao.findUserById(id)
                .map(UserMapper::toResponseDto)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + id + " not found."));
    }

    public UserResponseDto getUserByEmail(String email) {
        return userDao.findUserByEmail(email)
                .map(UserMapper::toResponseDto)
                .orElseThrow(() -> new UserNotFoundException("User with email " + email + " not found."));
    }

    public List<UserResponseDto> getAllUsers() {
        return userDao.findAllUsers().stream()
                .map(UserMapper::toResponseDto)
                .toList();
    }

    public void deleteUserById(Long id) {
        if (!userDao.existsUserById(id)) {
            throw new UserNotFoundException("Cannot delete — user with ID " + id + " not found.");
        }
        userDao.deleteUserById(id);
    }

    public void deleteUserByEmail(String email) {
        if (!userDao.existsUserByEmail(email)) {
            throw new UserNotFoundException("Cannot delete — user with email " + email + " not found.");
        }
        userDao.deleteUserByEmail(email);
    }

    public boolean isAdult(UserRequestDto request) {
        LocalDate today = LocalDate.now();
        LocalDate dob = request.dateOfBirth();
        return !dob.plusYears(18).isAfter(today);
    }
}
