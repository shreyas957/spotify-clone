package com.ncs.spotify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class SpotifyConfigServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpotifyConfigServerApplication.class, args);
    }

}
