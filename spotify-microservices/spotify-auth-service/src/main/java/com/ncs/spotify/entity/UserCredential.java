package com.ncs.spotify.entity;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Entity
@Table(
        name = "user_credentials",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "user_credentials_email_unique",
                        columnNames = "email"
                ),
                @UniqueConstraint(
                        name = "user_id_unique",
                        columnNames = "user_id"
                )
        }
)
public class UserCredential implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public UserCredential() {

    }

    public UserCredential(Long userId, String email, String password, LocalDateTime createdAt) {
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
    }

    public UserCredential(Long id, Long userId, String email, String password, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "UserCredential{" +
                "id=" + id +
                ", userId=" + userId +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        UserCredential that = (UserCredential) o;
        return Objects.equals(id, that.id) && Objects.equals(userId, that.userId) && Objects.equals(email, that.email) && Objects.equals(password, that.password) && Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, userId, email, password, createdAt);
    }
}
