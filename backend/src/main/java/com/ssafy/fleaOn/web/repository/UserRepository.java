package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.dto.UserDTO;
import com.ssafy.fleaOn.web.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    UserEntity findByUsername(String username);

    UserEntity findByEmail(String email);

}
