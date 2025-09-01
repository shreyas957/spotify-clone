package com.ncs.spotify.model.general;

import lombok.Data;

@Data
public class SpotifyLinkedFrom {
    private String id;   // sometimes empty, included for completeness
    private String href;
}
