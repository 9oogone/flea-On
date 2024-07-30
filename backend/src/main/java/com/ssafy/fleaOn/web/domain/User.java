package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "user_id", updatable = false)
    private String id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "profile_picture", nullable = false)
    private String profile_picture;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "phone")
    private String phone;

    @Column(name = "preferred_region")
    private String preferred_region;

    @Column(name = "level")
    private int level;

}
