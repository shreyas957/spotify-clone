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
@Table(name = "user_artist_pref")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserArtistPref {
    @EmbeddedId
    private UserArtistPrefKey id;

    @Column(name = "artist_name")
    private String artistName;

    private double score;

    @Column(name = "last_updated")
    private Instant lastUpdated;
}
