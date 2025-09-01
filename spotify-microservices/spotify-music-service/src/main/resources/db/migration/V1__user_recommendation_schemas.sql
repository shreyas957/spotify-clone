CREATE TABLE user_track_pref
(
    user_id      BIGINT      NOT NULL,
    track_id     VARCHAR(64) NOT NULL,
    track_name   VARCHAR(512),
    is_liked     BOOLEAN     NOT NULL DEFAULT FALSE,
    score        DOUBLE      NOT NULL DEFAULT 0,
    last_updated TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, track_id)
);

CREATE TABLE user_artist_pref
(
    user_id      BIGINT      NOT NULL,
    artist_id    VARCHAR(64) NOT NULL,
    artist_name  VARCHAR(256),
    score        DOUBLE      NOT NULL DEFAULT 0,
    last_updated TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, artist_id)
);

CREATE TABLE user_genre_pref
(
    user_id      BIGINT      NOT NULL,
    genre        VARCHAR(64) NOT NULL,
    score        DOUBLE      NOT NULL DEFAULT 0,
    last_updated TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, genre)
);
