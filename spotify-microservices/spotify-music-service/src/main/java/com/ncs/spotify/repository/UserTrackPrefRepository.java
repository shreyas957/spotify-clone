package com.ncs.spotify.repository;

import com.ncs.spotify.entity.UserTrackPref;
import com.ncs.spotify.entity.UserTrackPrefKey;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserTrackPrefRepository extends JpaRepository<UserTrackPref, UserTrackPrefKey> {
    @Query("SELECT u FROM UserTrackPref u WHERE u.id.userId = :userId ORDER BY u.score DESC")
    List<UserTrackPref> findTopByUserId(@Param("userId") Long userId, Pageable p);
}
