package com.ssafy.fleaOn.web.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class UserEntity {

    @Id
    private String id;

    private String username;

    private String profileImg;

    private String name;

    private String email;

    private String role;

    private int phoneNumber;

    private String preferredRegion;
}
