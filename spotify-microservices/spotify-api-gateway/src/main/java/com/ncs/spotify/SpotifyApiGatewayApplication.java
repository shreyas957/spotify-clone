package com.ncs.spotify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SpotifyApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpotifyApiGatewayApplication.class, args);
	}

}
