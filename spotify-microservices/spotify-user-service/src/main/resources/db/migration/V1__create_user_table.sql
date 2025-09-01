CREATE TABLE users
(
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    password      VARCHAR(255) NOT NULL,
    date_of_birth DATE         NOT NULL,
    gender        ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    country       VARCHAR(100),
    created_at    DATETIME     NOT NULL,
    CONSTRAINT user_email_unique UNIQUE (email)
);