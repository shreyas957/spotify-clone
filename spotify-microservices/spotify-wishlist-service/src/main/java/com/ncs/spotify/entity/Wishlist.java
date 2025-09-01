package com.ncs.spotify.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "wishlist")
@Data
public class Wishlist {
    @Id
    private String id;

    private Long userId;

    private String trackId;

    private Instant createdAt = Instant.now();
}
