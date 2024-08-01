package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

//    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    void deleteByEmail(String email);

//    User updateUserByEmail(String email, User user);

    User findByUserIdentifier(String userIdentifier);

}
