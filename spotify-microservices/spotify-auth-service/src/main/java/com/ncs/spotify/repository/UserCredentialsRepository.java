package com.ncs.spotify.repository;

import com.ncs.spotify.entity.UserCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserCredentialsRepository extends JpaRepository<UserCredential, Long> {
    Optional<UserCredential> findUserCredentialByEmail(String email);

    Optional<UserCredential> findUserCredentialByUserId(Long userId);

    Optional<UserCredential> getUserCredentialByUserId(Long userId);

    boolean existsUserCredentialByEmail(String email);

    void deleteUserCredentialByEmail(String email);

}
