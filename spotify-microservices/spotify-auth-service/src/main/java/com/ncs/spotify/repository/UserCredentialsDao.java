package com.ncs.spotify.repository;

import com.ncs.spotify.entity.UserCredential;

import java.util.Optional;

public interface UserCredentialsDao {

    void deleteUserCredentialsByEmail(String email);

    void deleteUserCredentialsById(Long id);

    void insertUserCredentials(UserCredential userCredential);

    void updateUserCredentials(UserCredential userCredential);

    boolean existsUserCredentialsByEmail(String email);

    Optional<UserCredential> findUserCredentialsByEmail(String email);

    Optional<UserCredential> findUserCredentialsById(Long id);

    Optional<UserCredential> findUserCredentialsByUserId(Long userId);

    Optional<UserCredential> getUserCredentialsByUserId(Long userId);

}
