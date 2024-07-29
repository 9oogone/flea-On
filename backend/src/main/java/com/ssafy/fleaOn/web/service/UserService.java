package com.ssafy.fleaOn.web.service;


import com.ssafy.fleaOn.web.dto.UserDTO;
import com.ssafy.fleaOn.web.entity.UserEntity;
import com.ssafy.fleaOn.web.repository.CustomUserRepository;
import com.ssafy.fleaOn.web.repository.CustomUserRepositoryImpl;
import com.ssafy.fleaOn.web.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomUserRepositoryImpl customUserRepositoryImpl;

    public UserEntity findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteMember(String email) {
        customUserRepositoryImpl.deleteMember(email);
    }




}
