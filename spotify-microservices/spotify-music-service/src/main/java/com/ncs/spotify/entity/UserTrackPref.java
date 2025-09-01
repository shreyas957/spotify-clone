package com.ncs.spotify.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "user_track_pref")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTrackPref {
    @EmbeddedId
    private UserTrackPrefKey id;

    @Column(name = "track_name")
    private String trackName;

    @Column(name = "is_liked")
    private boolean liked;

    private double score;

    @Column(name = "last_updated")
    private Instant lastUpdated;
}
