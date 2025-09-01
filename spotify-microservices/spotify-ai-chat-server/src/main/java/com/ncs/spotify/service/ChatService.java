package com.ncs.spotify.service;

import com.google.genai.types.GenerateContentResponse;
import com.ncs.spotify.dto.ChatResponseDto;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class ChatService {
    private final WebClient webClient;

    public ChatService(WebClient webClient) {
        this.webClient = webClient;
    }

    public ChatResponseDto generateResponse(String message) {
        Map<String, Object> request = Map.of(
                "systemInstruction", Map.of(
                        "parts", List.of(
                                Map.of("text", "You are a helpful AI assistant, answering user questions related to music such as names, lyrics, etc.. Respond in simple text format and not Markdown or other type.")
                        )
                ),
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", message)
                        ))
                )
        );

        GenerateContentResponse response = webClient.post()
                .uri("/gemini-2.5-flash:generateContent")
                .body(BodyInserters.fromValue(request))
                .retrieve()
                .bodyToMono(GenerateContentResponse.class)
                .block();
        assert response != null;
        return new ChatResponseDto(response.text());
    }
}
