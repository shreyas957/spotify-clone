package com.ncs.spotify.service;

import lombok.Data;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class SpotifyAuthService {

    private final WebClient webClient;
    private final String clientId;
    private final String clientSecret;

    // Store token + expiry in memory
    private final AtomicReference<String> cachedToken = new AtomicReference<>();
    private final AtomicReference<Instant> expiryTime = new AtomicReference<>(Instant.EPOCH);

    public SpotifyAuthService(
            @Qualifier("token-web-client") WebClient tokenWebClient,
            @Value("${spotify.client-id}") String clientId,
            @Value("${spotify.client-secret}") String clientSecret
    ) {
        this.webClient = tokenWebClient;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    /**
     * Returns a valid access token. Refreshes if expired or missing.
     */
    public String getAccessToken() {
        if (cachedToken.get() == null || Instant.now().isAfter(expiryTime.get())) {
            synchronized (this) { // double-check locking
                if (cachedToken.get() == null || Instant.now().isAfter(expiryTime.get())) {
                    AccessTokenResponse response = requestNewToken();
                    cachedToken.set(response.getAccessToken());
                    expiryTime.set(Instant.now().plusSeconds(response.getExpires_in() - 60)); // subtract buffer
                }
            }
        }
        return cachedToken.get();
    }

    /**
     * Actually calls Spotify API to fetch a new token.
     */
    private AccessTokenResponse requestNewToken() {
        String authStr = clientId + ":" + clientSecret;
        String base64Creds = Base64.getEncoder().encodeToString(authStr.getBytes(StandardCharsets.UTF_8));

        return webClient.post()
                .uri("")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .header("Authorization", "Basic " + base64Creds)
                .bodyValue("grant_type=client_credentials")
                .retrieve()
                .bodyToMono(AccessTokenResponse.class)
                .block();
    }

    @Data
    public static class AccessTokenResponse {
        private String access_token;
        private String token_type;
        private int expires_in;

        public String getAccessToken() {
            return access_token;
        }
    }
}