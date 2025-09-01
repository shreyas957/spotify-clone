package com.ncs.spotify.service;


import com.ncs.spotify.repository.UserCredentialsDao;
import com.ncs.spotify.repository.UserCredentialsJpaImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserCredentialsDetailService implements UserDetailsService {
    private final UserCredentialsDao userCredentialsDao;

    public UserCredentialsDetailService(UserCredentialsJpaImpl userCredentialsDao) {
        this.userCredentialsDao = userCredentialsDao;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userCredentialsDao.findUserCredentialsByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }
}
