CREATE TABLE user_credentials
(
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    user_id    BIGINT       NOT NULL,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    created_at DATETIME     NOT NULL,
    CONSTRAINT pk_user_credentials PRIMARY KEY (id),
    CONSTRAINT user_credentials_email_unique UNIQUE (email),
    CONSTRAINT user_id_unique UNIQUE (user_id)
);
