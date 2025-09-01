package com.ncs.spotify.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {
    @Value("${user.service.host}")
    private String userServiceUrl;

    @Value("${auth.service.host}")
    private String authServiceUrl;

    @Value("${music.service.host}")
    private String musicServiceUrl;

    @Value("${wishlist.service.host}")
    private String wishlistServiceUrl;

    @Value("${ai-llm-chat.service.host}")
    private String aiLlmChatServiceUrl;

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        return builder.routes()

                .route("user-service", r -> r.path("/api/v1/users/**")
                        .uri(userServiceUrl))

                .route("auth-service", r -> r.path("/api/v1/user-credentials/**", "/api/v1/auth/**")
                        .uri(authServiceUrl))

                .route("music-service", r -> r.path("/api/v1/recommendation/**", "/api/v1/tracks/**")
                        .uri(musicServiceUrl))

                .route("wishlist-service", r -> r.path("/api/v1/wishlist/**")
                        .uri(wishlistServiceUrl))

                .route("ai-llm-chat-service", r -> r.path("/api/v1/chat/**")
                        .uri(aiLlmChatServiceUrl))

                .route("user-service-swagger", r -> r.path("/aggregate/user-service/v3/api-docs")
                        .filters(f -> f.setPath("/v3/api-docs"))
                        .uri(userServiceUrl))

                .route("auth-service-swagger", r -> r.path("/aggregate/auth-service/v3/api-docs")
                        .filters(f -> f.setPath("/v3/api-docs"))
                        .uri(authServiceUrl))

                .route("music-service-swagger", r -> r.path("/aggregate/music-service/v3/api-docs")
                        .filters(f -> f.setPath("/v3/api-docs"))
                        .uri(musicServiceUrl))

                .route("wishlist-service-swagger", r -> r.path("/aggregate/wishlist-service/v3/api-docs")
                        .filters(f -> f.setPath("/v3/api-docs"))
                        .uri(wishlistServiceUrl))

                .route("ai-llm-chat-service-swagger", r -> r.path("/aggregate/ai-llm-chat-service/v3/api-docs")
                        .filters(f -> f.setPath("/v3/api-docs"))
                        .uri(aiLlmChatServiceUrl))

                .build();
    }
}
