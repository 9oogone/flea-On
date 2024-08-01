package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.time.LocalDateTime;

@Entity
@Table(name = "shorts")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@Builder
public class Shorts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shorts_id")
    private int shortsId;

    @Column(name = "product_id")
    private int productId;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "length")
    private Time length;

    @Column(name = "video_address")
    private String videoAddress;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;
}
