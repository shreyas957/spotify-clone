package com.ncs.spotify.mapper;

import com.ncs.spotify.dto.TrackDto;
import com.ncs.spotify.model.artist.SpotifyArtist;
import com.ncs.spotify.model.track.SpotifyTrack;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class TrackMapper {

    public TrackDto toTrackDto(SpotifyTrack s) {
        if (s == null) return null;
        TrackDto dto = new TrackDto();
        dto.setId(s.getId());
        dto.setName(s.getName());
        List<String> artists = Optional.ofNullable(s.getArtists())
                .orElse(List.of())
                .stream().map(SpotifyArtist::getName).collect(Collectors.toList());
        dto.setArtists(artists);

        if (s.getAlbum() != null) {
            dto.setAlbumId(s.getAlbum().getId());
            dto.setAlbumName(s.getAlbum().getName());
        }
        dto.setDurationMs(s.getDurationMs());
        dto.setPreviewUrl(s.getPreviewUrl());
        dto.setPopularity(s.getPopularity());
        dto.setExternalUrl(s.getExternalUrls() != null ? s.getExternalUrls().get("spotify") : null);
        dto.setExplicit(s.isExplicit());
        return dto;
    }
}
