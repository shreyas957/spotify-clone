package com.ncs.spotify.client;

import com.ncs.spotify.dto.UserResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "spotify-user-service", url = "${USER_SERVICE_HOST}")
public interface UserServiceClient {

    @GetMapping("/api/v1/users/{id}")
    UserResponseDto getUserById(@PathVariable("id") Long id);
}
