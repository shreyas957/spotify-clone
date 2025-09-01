package com.ncs.spotify.model.general;

import lombok.Data;

@Data
public class SpotifyRestriction {
    private String reason; // e.g. market, product, explicit
}
