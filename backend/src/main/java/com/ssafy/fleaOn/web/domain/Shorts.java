package com.ssafy.fleaOn.web.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.ssafy.fleaOn.web.util.LocalDateTimeDeserializer;
import com.ssafy.fleaOn.web.util.LocalDateTimeSerializer;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

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

    @OneToMany(mappedBy = "shorts", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ShortsScrap> shortsScrapSet;

    @Column(name = "thumbnail")
    private String shortsThumbnail;

    @Column(name = "length")
    private LocalTime length;

    @Column(name = "video_address")
    private String videoAddress;

    @Column(name = "upload_date")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime uploadDate;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User seller;

    @Builder
    public Shorts(String shortsThumbnail, LocalTime length, String videoAddress, LocalDateTime uploadDate, Product product, User user) {
        this.shortsThumbnail = shortsThumbnail;
        this.length = length;
        this.videoAddress = videoAddress;
        this.uploadDate = uploadDate;
        this.product = product;
        this.seller = user;
    }
}
