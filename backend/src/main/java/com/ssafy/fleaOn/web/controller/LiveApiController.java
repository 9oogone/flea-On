package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.dto.AddLiveRequest;
import com.ssafy.fleaOn.web.service.LiveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fleaOn/live")
public class LiveApiController {

    private final LiveService liveService;

    @PostMapping
    public ResponseEntity<Live> createLive(@RequestBody AddLiveRequest request, Principal principal) {
//        int sellerID =
//        Live savedLive = liveService.saveLive(request, sellerID);
//        // 요청한 자원이 성공적으로 생성되었으며 저장된 블로그 글 정보를 응답 객체에 담아 전송
//        return ResponseEntity.status(HttpStatus.CREATED).body(savedLive);
    }
}

