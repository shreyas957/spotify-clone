package com.ncs.spotify.kafka;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackPlayedEvent implements Serializable {
    private Long userId;
    private String trackId;
    private String trackName;
    private List<String> artistIds;
    private List<String> genres;
    private Integer msPlayed;      // milliseconds played
    private Instant playedAt;
}
