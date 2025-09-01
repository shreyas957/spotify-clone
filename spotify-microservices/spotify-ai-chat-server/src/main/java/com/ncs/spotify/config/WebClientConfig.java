package com.ncs.spotify.config;

import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import javax.net.ssl.SSLException;

@Configuration
public class WebClientConfig {

    @Value("${gemini.api.key}")
    private String API_KEY;

    private HttpClient createInsecureHttpClient() throws Exception {

        return HttpClient.create()
                .secure(t -> {
                    try {
                        t.sslContext(
                                SslContextBuilder.forClient()
                                        .trustManager(InsecureTrustManagerFactory.INSTANCE) // trust all certs
                                        .build()
                        );
                    } catch (SSLException e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    @Bean()
    public WebClient spotifyApiWebClient() throws Exception {
        return WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models")
                .defaultHeader("x-goog-api-key", API_KEY) // 🔑 API key header
                .defaultHeader("Content-Type", "application/json")
                .clientConnector(new ReactorClientHttpConnector(createInsecureHttpClient()))
                .build();
    }
}
