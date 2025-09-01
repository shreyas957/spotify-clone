package com.ncs.spotify.repository;

import com.ncs.spotify.entity.Gender;
import com.ncs.spotify.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserDao {

    void insertUser(User user);

    void updateUser(User user);

    void deleteUserById(Long id);

    void deleteUserByEmail(String email);

    Optional<User> findUserById(Long id);

    Optional<User> findUserByEmail(String email);

    List<User> findAllUsers();

    boolean existsUserById(Long id);

    boolean existsUserByEmail(String email);

    boolean existsUserByName(String name);

    boolean existsUserByEmailExcludingCurrentUser(String email, Long currentUserId);

    // Search Queries
    List<User> findUsersByName(String name);

    List<User> findUsersByCountry(String country);

    List<User> findUsersByGender(Gender gender);

}
