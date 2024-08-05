package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    void deleteByEmail(String email);

    User findByUserIdentifier(String userIdentifier);
}