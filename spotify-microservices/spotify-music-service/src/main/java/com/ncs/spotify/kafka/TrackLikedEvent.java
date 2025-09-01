package com.ncs.spotify.kafka;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackLikedEvent implements Serializable {
    private Long userId;
    private String trackId;
    private boolean liked;
    private Instant likedAt;
}
