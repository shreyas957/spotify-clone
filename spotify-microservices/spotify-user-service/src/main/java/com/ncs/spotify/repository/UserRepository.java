package com.ncs.spotify.repository;

import com.ncs.spotify.entity.Gender;
import com.ncs.spotify.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    void deleteUserByEmail(String email);

    Optional<User> findUserByEmail(String email);

    boolean existsUserByEmail(String email);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.email = :email AND u.id <> :currentId")
    boolean existsUserByEmailExcludingCurrent(@Param("email") String email, @Param("currentId") Long currentId);

    boolean existsUserByName(String username);

    List<User> findUsersByName(String name);

    List<User> findUsersByGender(Gender gender);

    List<User> findUsersByCountry(String country);

}
