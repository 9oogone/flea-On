package com.ssafy.fleaOn.web.service;


import com.ssafy.fleaOn.web.entity.User;
import com.ssafy.fleaOn.web.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteUserByEmail(String email) {
        userRepository.deleteByEmail(email);
    }




}
