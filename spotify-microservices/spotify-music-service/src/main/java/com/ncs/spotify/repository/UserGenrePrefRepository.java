package com.ncs.spotify.repository;

import com.ncs.spotify.entity.UserGenrePref;
import com.ncs.spotify.entity.UserGenrePrefKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserGenrePrefRepository extends JpaRepository<UserGenrePref, UserGenrePrefKey> {
    List<UserGenrePref> findTop20ByIdUserIdOrderByScoreDesc(Long userId);
}
