package com.ncs.spotify.repository;

import com.ncs.spotify.entity.UserCredential;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserCredentialsJpaImpl implements UserCredentialsDao {
    private final UserCredentialsRepository userCredentialsRepository;

    public UserCredentialsJpaImpl(UserCredentialsRepository userCredentialsRepository) {
        this.userCredentialsRepository = userCredentialsRepository;
    }

    @Override
    public void deleteUserCredentialsByEmail(String email) {
        userCredentialsRepository.deleteUserCredentialByEmail(email);
    }

    @Override
    public void deleteUserCredentialsById(Long id) {
        userCredentialsRepository.deleteById(id);
    }

    @Override
    public void insertUserCredentials(UserCredential userCredential) {
        userCredentialsRepository.save(userCredential);
    }

    @Override
    public void updateUserCredentials(UserCredential userCredential) {
        userCredentialsRepository.save(userCredential);
    }

    @Override
    public boolean existsUserCredentialsByEmail(String email) {
        return userCredentialsRepository.existsUserCredentialByEmail(email);
    }

    @Override
    public Optional<UserCredential> findUserCredentialsByEmail(String email) {
        return userCredentialsRepository.findUserCredentialByEmail(email);
    }

    @Override
    public Optional<UserCredential> findUserCredentialsById(Long id) {
        return userCredentialsRepository.findById(id);
    }

    @Override
    public Optional<UserCredential> findUserCredentialsByUserId(Long userId) {
        return userCredentialsRepository.findUserCredentialByUserId(userId);
    }

    @Override
    public Optional<UserCredential> getUserCredentialsByUserId(Long userId) {
        return userCredentialsRepository.getUserCredentialByUserId(userId);
    }
}
