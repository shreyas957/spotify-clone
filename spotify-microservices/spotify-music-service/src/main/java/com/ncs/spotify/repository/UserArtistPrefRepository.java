package com.ncs.spotify.repository;

import com.ncs.spotify.entity.UserArtistPref;
import com.ncs.spotify.entity.UserArtistPrefKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserArtistPrefRepository extends JpaRepository<UserArtistPref, UserArtistPrefKey> {
    List<UserArtistPref> findTop20ByIdUserIdOrderByScoreDesc(Long userId);

    @Query("SELECT u FROM UserArtistPref u WHERE u.id.userId = :userId")
    List<UserArtistPref> findByUserId(@Param("userId") Long userId);
}
