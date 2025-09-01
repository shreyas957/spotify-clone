package com.ncs.spotify.repository;

import com.ncs.spotify.entity.Gender;
import com.ncs.spotify.entity.User;
import com.ncs.spotify.event.KafkaProducerService;
import com.ncs.spotify.event.mapper.UserEventMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserDaoJpaImpl implements UserDao {

    private final UserRepository userRepository;
    private final KafkaProducerService kafkaProducerService;

    public UserDaoJpaImpl(UserRepository userRepository, KafkaProducerService kafkaProducerService) {
        this.userRepository = userRepository;
        this.kafkaProducerService = kafkaProducerService;
    }

    @Override
    public void insertUser(User user) {
        userRepository.save(user);
        kafkaProducerService.sendUserCreated(UserEventMapper.toUserCreatedEvent(user));
    }

    @Override
    public void updateUser(User user) {
        userRepository.save(user);
    }

    @Override
    public void deleteUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        kafkaProducerService.sendUserDeleted(UserEventMapper.toUserDeletedEvent(user.orElse(new User())));
        userRepository.deleteById(id);
    }

    @Override
    public void deleteUserByEmail(String email) {
        Optional<User> user = userRepository.findUserByEmail(email);
        kafkaProducerService.sendUserDeleted(UserEventMapper.toUserDeletedEvent(user.orElse(new User())));
        userRepository.deleteUserByEmail(email);
    }

    @Override
    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public boolean existsUserById(Long id) {
        return userRepository.existsById(id);
    }

    @Override
    public boolean existsUserByEmail(String email) {
        return userRepository.existsUserByEmail(email);
    }

    @Override
    public boolean existsUserByName(String name) {
        return userRepository.existsUserByName(name);
    }

    @Override
    public boolean existsUserByEmailExcludingCurrentUser(String email, Long currentUserId) {
        return userRepository.existsUserByEmailExcludingCurrent(email, currentUserId);
    }

    @Override
    public List<User> findUsersByName(String name) {
        return userRepository.findUsersByName(name);
    }

    @Override
    public List<User> findUsersByCountry(String country) {
        return userRepository.findUsersByCountry(country);
    }

    @Override
    public List<User> findUsersByGender(Gender gender) {
        return userRepository.findUsersByGender(gender);
    }
}
