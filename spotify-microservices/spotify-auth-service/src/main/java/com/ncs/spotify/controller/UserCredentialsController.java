package com.ncs.spotify.controller;

import com.ncs.spotify.entity.UserCredential;
import com.ncs.spotify.jwt.JWTUtil;
import com.ncs.spotify.service.UserCredentialsService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/user-credentials")
public class UserCredentialsController {

    private final UserCredentialsService service;
    private final JWTUtil jwtUtil;

    public UserCredentialsController(UserCredentialsService service, JWTUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<UserCredential> createUser(@RequestBody UserCredential user) {
        service.insertUserCredentialsViaController(user);
        String token = jwtUtil.issueToken(user.getUsername(), "ROLE_USER");

        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.AUTHORIZATION, token)
                .body(user);
    }

    // READ by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserCredential> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getUserCredById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserCredential> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok().body(service.getUSerCredentialsByUserId(userId));
    }

    // READ by Email
    @GetMapping
    public ResponseEntity<UserCredential> getByEmail(@RequestParam String email) {
        return ResponseEntity.ok(service.getUserCredByEmail(email));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<UserCredential> updateUser(
            @PathVariable Long id,
            @RequestBody UserCredential updatedUser
    ) {
        UserCredential existing = service.getUserCredById(id);
        existing.setEmail(updatedUser.getEmail());
        existing.setPassword(updatedUser.getPassword());
        service.updateUserCredentials(existing);
        return ResponseEntity.ok(existing);
    }

    // DELETE by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteById(@PathVariable Long id) {
        service.deleteUserCredById(id);
        return ResponseEntity.ok(Map.of("message", "User with id " + id + " deleted successfully"));
    }

    // DELETE by Email
    @DeleteMapping
    public ResponseEntity<Map<String, String>> deleteByEmail(@RequestParam String email) {
        service.deleteUserCredByEmail(email);
        return ResponseEntity.ok(Map.of("message", "User with email " + email + " deleted successfully"));
    }

    @PostMapping("/verify-password")
    public ResponseEntity<Map<String, Boolean>> verifyPassword(
            @RequestBody Map<String, String> payload
    ) {
        String email = payload.get("email");
        String password = payload.get("password");

        boolean matches = service.verifyPassword(email, password);

        if (!matches) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("valid", false));
        }
        return ResponseEntity.ok(Map.of("valid", true));
    }
}
