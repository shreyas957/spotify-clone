package com.ncs.spotify.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {
    @Bean
    public OpenAPI chatServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("LLM Chat Service")
                        .description("This is the spotify LLM chat service API")
                        .version("v0.0.1")
                        .license(new License().name("Apache 2")))
                .externalDocs(new ExternalDocumentation()
                        .description("Find More About Building a AI apps with spring boot")
                        .url("https://docs.spring.io/spring-ai/reference/api/chat/openai-chat.html")
                );
    }
}
