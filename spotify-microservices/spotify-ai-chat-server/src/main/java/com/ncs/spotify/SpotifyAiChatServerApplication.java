package com.ncs.spotify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SpotifyAiChatServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpotifyAiChatServerApplication.class, args);
	}

}
