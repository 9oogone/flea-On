package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.AddLiveRequest;
import com.ssafy.fleaOn.web.dto.UpdateLiveRequest;
import com.ssafy.fleaOn.web.service.LiveService;
import com.ssafy.fleaOn.web.service.UserService;
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
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Live> createLive(@RequestBody AddLiveRequest request, Principal principal) {
        String userEmail = principal.getName(); // 현재 인증된 사용자의 이메일 가져오기
        System.out.println("!!!!Email: "+userEmail);
        User user = userService.findByEmail(userEmail); // 이메일로 userId 가져오기
        Live savedLive = liveService.saveLive(request, user);
        // 요청한 자원이 성공적으로 생성되었으며 저장된 Live 정보를 응답 객체에 담아 전송
        return ResponseEntity.status(HttpStatus.CREATED).body(savedLive);
    }

    @PutMapping("/{liveID}")
    public ResponseEntity<Live> updateLive(@PathVariable int liveID, @RequestBody UpdateLiveRequest request) {
        User user = userService.findByEmail(request.getUserEmail()); // 이메일로 사용자 정보를 가져옴
        Live updatedLive = liveService.updateLive(liveID, request, user); // 서비스를 통해 Live 정보를 업데이트
        return ResponseEntity.ok(updatedLive); // 업데이트된 Live 정보 반환
    }

//    @DeleteMapping("/{id}/")
//    public ResponseEntity<Void> deleteLive(@PathVariable long id) {
//        liveService.delete(id);
//
//        return ResponseEntity.ok()
//                .build();
//    }
}

