package com.ncs.spotify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
//@OpenAPIDefinition(info =
//@Info(title = "User Service API", version = "1.0.0", description = "Documentation User Service API v1.0")
//)
public class SpotifyUserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpotifyUserServiceApplication.class, args);
    }

}
