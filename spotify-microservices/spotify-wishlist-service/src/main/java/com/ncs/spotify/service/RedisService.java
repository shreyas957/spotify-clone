package com.ncs.spotify.service;

import com.ncs.spotify.model.track.SpotifyTrack;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {
    private final RedisTemplate<String, SpotifyTrack> redisTemplate;

    public RedisService(RedisTemplate<String, SpotifyTrack> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public SpotifyTrack get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void set(String key, SpotifyTrack value, Long ttl) {
        redisTemplate.opsForValue().set(key, value, ttl, TimeUnit.DAYS);
    }
}
