package com.ncs.spotify.config;

import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import javax.net.ssl.SSLException;

@Configuration
public class WebClientConfig {

    @Value("${spotify.api-base-url}")
    private String apiBaseUrl;

    @Value("${spotify.token-url}")
    private String tokenUrl;

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

    @Bean(name = "api-web-client")
    public WebClient spotifyApiWebClient() throws Exception {
        return WebClient.builder()
                .baseUrl(apiBaseUrl)
                .clientConnector(new ReactorClientHttpConnector(createInsecureHttpClient()))
                .build();
    }

    @Bean(name = "token-web-client")
    public WebClient spotifyTokenWebClient() throws Exception {
        return WebClient.builder()
                .baseUrl(tokenUrl)
                .clientConnector(new ReactorClientHttpConnector(createInsecureHttpClient()))
                .build();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate(); // use default SSL (safe)
    }
}