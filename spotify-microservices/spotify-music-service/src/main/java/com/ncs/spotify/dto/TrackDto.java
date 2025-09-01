package com.ncs.spotify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackDto {
    private String id;
    private String name;
    private List<String> artists;
    private String albumId;
    private String albumName;
    private Integer durationMs;
    private String previewUrl;
    private Integer popularity;
    private String externalUrl;
    private Boolean explicit;
}
