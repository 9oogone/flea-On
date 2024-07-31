package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByUserIdentifier(String userIdentifier);

    User findByEmail(String email);

    void deleteByEmail(String email);

//    User updateUserByEmail(String email, User user);

}
