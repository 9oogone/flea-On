package com.ssafy.fleaOn.web.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.ssafy.fleaOn.web.util.LocalDateTimeDeserializer;
import com.ssafy.fleaOn.web.util.LocalDateTimeSerializer;
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

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "length")
    private Time length;

    @Column(name = "video_address")
    private String videoAddress;

    @Column(name = "upload_date")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime uploadDate;

    @ManyToOne
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;
}
