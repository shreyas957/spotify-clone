package com.ncs.spotify.service;

import com.ncs.spotify.client.UserServiceClient;
import com.ncs.spotify.dto.AuthenticationRequest;
import com.ncs.spotify.dto.AuthenticationResponse;
import com.ncs.spotify.dto.UserResponseDto;
import com.ncs.spotify.entity.UserCredential;
import com.ncs.spotify.jwt.JWTUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final UserServiceClient userServiceClient;

    public AuthenticationService(AuthenticationManager authenticationManager, JWTUtil jwtUtil, UserServiceClient userServiceClient) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userServiceClient = userServiceClient;
    }

    //Method which allow customers to login
    public AuthenticationResponse login(AuthenticationRequest request) {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        UserCredential principal = (UserCredential) authenticate.getPrincipal();
        String token = jwtUtil.issueToken(principal.getUsername(), "ROLE_USER");

        // Get full user profile from user-service
        UserResponseDto userProfile = userServiceClient.getUserById(principal.getUserId());

        return new AuthenticationResponse(token, userProfile);
    }
}
