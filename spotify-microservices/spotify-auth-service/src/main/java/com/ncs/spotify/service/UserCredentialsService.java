package com.ncs.spotify.service;

import com.ncs.spotify.entity.UserCredential;
import com.ncs.spotify.exception.DuplicateResourceException;
import com.ncs.spotify.exception.ResourceNotFoundException;
import com.ncs.spotify.repository.UserCredentialsJpaImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class UserCredentialsService {

    private final UserCredentialsJpaImpl userCredentialsJpaImpl;
    private final PasswordEncoder bCryptPasswordEncoder;

    public UserCredentialsService(UserCredentialsJpaImpl userCredentialsJpaImpl, PasswordEncoder bCryptPasswordEncoder) {
        this.userCredentialsJpaImpl = userCredentialsJpaImpl;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public void insertUserCredentialsViaController(UserCredential uc) {
        uc.setPassword(bCryptPasswordEncoder.encode(uc.getPassword()));
        insertUserCredentials(uc);
    }

    public void insertUserCredentialsViaKafka(UserCredential uc) {
        insertUserCredentials(uc);
    }

    public void insertUserCredentials(UserCredential userCredential) {
        userCredential.setCreatedAt(LocalDateTime.now());
        if (userCredentialsJpaImpl.existsUserCredentialsByEmail(userCredential.getEmail())) {
            throw new DuplicateResourceException(
                    "User with email %s already exists".formatted(userCredential.getEmail())
            );
        }
//        userCredential.setPassword(bCryptPasswordEncoder.encode(userCredential.getPassword()));
        userCredentialsJpaImpl.insertUserCredentials(userCredential);
    }

    public UserCredential getUserCredByEmail(String email) {
        return userCredentialsJpaImpl.findUserCredentialsByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User with email %s does not exist".formatted(email)
                ));
    }

    public UserCredential getUserCredById(Long userId) {
        return userCredentialsJpaImpl.findUserCredentialsById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User with id %d does not exist".formatted(userId)
                ));
    }

    public void updateUserCredentials(UserCredential userCredential) {
        if (userCredential.getId() != null) {
            if (userCredentialsJpaImpl.findUserCredentialsById(userCredential.getId()).isEmpty()) {
                throw new ResourceNotFoundException(
                        "User with id %d does not exist".formatted(userCredential.getId())
                );
            }
        } else {
            throw new IllegalArgumentException("User ID must be provided for update");
        }
        userCredentialsJpaImpl.updateUserCredentials(userCredential);
    }

    public void deleteUserCredByEmail(String email) {
        if (!userCredentialsJpaImpl.existsUserCredentialsByEmail(email)) {
            throw new ResourceNotFoundException(
                    "User with email %s does not exist".formatted(email)
            );
        }
        userCredentialsJpaImpl.deleteUserCredentialsByEmail(email);
    }

    public void deleteUserCredById(Long id) {
        Optional<UserCredential> userCredentials = userCredentialsJpaImpl.findUserCredentialsById(id);
        if (userCredentials.isEmpty()) {
            throw new ResourceNotFoundException(
                    "User with id %d does not exist".formatted(id)
            );
        }
        userCredentialsJpaImpl.deleteUserCredentialsById(id);
    }

    public UserCredential findUserCredentialsByUserId(Long userId) {
        return userCredentialsJpaImpl.findUserCredentialsByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User with id %d does not exist".formatted(userId))
                );
    }

    public UserCredential getUSerCredentialsByUserId(Long userId) {
        return userCredentialsJpaImpl.getUserCredentialsByUserId(userId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("User with id %d does not exist".formatted(userId))
                );
    }

    public boolean verifyPassword(String email, String password) {
        UserCredential user = getUserCredByEmail(email);
        if (user == null) {
            return false;
        }

        return bCryptPasswordEncoder.matches(password, user.getPassword());
    }
}
