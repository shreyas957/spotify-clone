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
@Table(name = "user_genre_pref")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserGenrePref {
    @EmbeddedId
    private UserGenrePrefKey id;

    private double score;
    @Column(name = "last_updated")
    private Instant lastUpdated;
}