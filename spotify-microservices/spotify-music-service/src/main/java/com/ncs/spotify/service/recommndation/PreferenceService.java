package com.ncs.spotify.service.recommndation;

import com.ncs.spotify.entity.*;
import com.ncs.spotify.kafka.TrackLikedEvent;
import com.ncs.spotify.kafka.TrackPlayedEvent;
import com.ncs.spotify.repository.UserArtistPrefRepository;
import com.ncs.spotify.repository.UserGenrePrefRepository;
import com.ncs.spotify.repository.UserTrackPrefRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;

@Service
public class PreferenceService {

    private final UserTrackPrefRepository trackRepo;
    private final UserArtistPrefRepository artistRepo;
    private final UserGenrePrefRepository genreRepo;

    public PreferenceService(UserTrackPrefRepository trackRepo, UserArtistPrefRepository artistRepo, UserGenrePrefRepository genreRepo) {
        this.trackRepo = trackRepo;
        this.artistRepo = artistRepo;
        this.genreRepo = genreRepo;
    }

    // decay daily factor
    private double decayFactor(Instant lastUpdated) {
        if (lastUpdated == null) return 1.0;
        long days = Duration.between(lastUpdated, Instant.now()).toDays();
        return Math.pow(0.98, Math.max(0, days));
    }

    @Transactional
    public void handleTrackPlayed(TrackPlayedEvent e) {
        // update track pref
        var key = new UserTrackPrefKey(e.getUserId(), e.getTrackId());
        var pref = trackRepo.findById(key).orElseGet(() -> new UserTrackPref(key, e.getTrackName(), false, 0.0, Instant.now()));
        double d = decayFactor(pref.getLastUpdated());
        double weight = (e.getMsPlayed() != null && e.getMsPlayed() >= 60000) ? 1.0 : 0.3;
        pref.setScore(pref.getScore() * d + weight);
        pref.setLastUpdated(Instant.now());
        trackRepo.save(pref);

        // update artists
        for (String aid : e.getArtistIds()) {
            var ak = new UserArtistPrefKey(e.getUserId(), aid);
            var ap = artistRepo.findById(ak).orElseGet(() -> new UserArtistPref(ak, null, 0.0, Instant.now()));
            double da = decayFactor(ap.getLastUpdated());
            ap.setScore(ap.getScore() * da + 0.6);
            ap.setLastUpdated(Instant.now());
            artistRepo.save(ap);
        }

        // update genres
        for (String g : e.getGenres()) {
            var gk = new UserGenrePrefKey(e.getUserId(), g.toLowerCase());
            var gp = genreRepo.findById(gk).orElseGet(() -> new UserGenrePref(gk, 0.0, Instant.now()));
            double dg = decayFactor(gp.getLastUpdated());
            gp.setScore(gp.getScore() * dg + 0.4);
            gp.setLastUpdated(Instant.now());
            genreRepo.save(gp);
        }
    }

    @Transactional
    public void handleTrackLiked(TrackLikedEvent e) {
        var key = new UserTrackPrefKey(e.getUserId(), e.getTrackId());
        var pref = trackRepo.findById(key).orElseGet(() -> new UserTrackPref(key, null, false, 0.0, Instant.now()));
        double d = decayFactor(pref.getLastUpdated());
        pref.setScore(pref.getScore() * d + (e.isLiked() ? 5.0 : -3.0));
        pref.setLiked(e.isLiked());
        pref.setLastUpdated(Instant.now());
        trackRepo.save(pref);
    }
}
