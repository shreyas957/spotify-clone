package com.ncs.spotify.controller;

import com.ncs.spotify.dto.UserRequestDto;
import com.ncs.spotify.dto.UserResponseDto;
import com.ncs.spotify.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create user
    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(@RequestBody UserRequestDto request) {
        UserResponseDto createdUser = userService.createUser(request);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Long id,
            @RequestBody UserRequestDto request
    ) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Get user by Email
    @GetMapping("/by-email")
    public ResponseEntity<UserResponseDto> getUserByEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    // Get all users
    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Delete user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    // Delete user by Email
    @DeleteMapping("/by-email")
    public ResponseEntity<Void> deleteUserByEmail(@RequestParam String email) {
        userService.deleteUserByEmail(email);
        return ResponseEntity.noContent().build();
    }

    // Check if user is adult
    @PostMapping("/is-adult")
    public ResponseEntity<Boolean> isAdult(@RequestBody UserRequestDto request) {
        return ResponseEntity.ok(userService.isAdult(request));
    }
}
