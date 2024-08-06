//package com.ssafy.fleaOn.web.controller;
//
//import com.ssafy.fleaOn.web.config.jwt.JWTUtil;
//import com.ssafy.fleaOn.web.domain.User;
//import com.ssafy.fleaOn.web.service.ShortsService;
//import com.ssafy.fleaOn.web.service.UserService;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import jakarta.servlet.http.HttpServletRequest;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/fleaon/shorts")
//@Tag(name = "shorts API", description = "shorts 관련 API")
//public class ShortsApiController {
//
//    private final ShortsService shortsService;
//
//    private final UserService userService;
//
//    @Operation(summary = "스크랩한 쇼츠 추가", description = "회원이 쇼츠를 스크랩할 때 사용합니다. ")
//    @PostMapping("/{shortsId}/shortsScrap")
//    public ResponseEntity<?> addUserShortsScrap(HttpServletRequest request, @RequestParam("shortsId")int shortsId) {
//        try {
//            String authorizationHeader = request.getHeader("Authorization");
//            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
//                String jwtToken = authorizationHeader.substring(7).trim();
//                String email = JWTUtil.getEmail(jwtToken);
//                User user = userService.findByEmail(email);
//                if (user != null) {
//                    shortsService.addUserShortsScrap(user.getUserId(), shortsId);
//                    return ResponseEntity.status(HttpStatus.OK).body(user);
//                }
//                else {
//                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//                }
//            }
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization 헤더가 없거나 형식이 올바르지 않습니다. ");
//        }
//        catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }
//
//    @Operation(summary = "스크랩한 쇼츠 삭제", description = "회원이 스크랩한 쇼츠를 삭제할 때 사용합니다. ")
//    @DeleteMapping("/{shortsId}/shortsScrap")
//    public ResponseEntity<?> deleteUserShortsScrap(HttpServletRequest request, @RequestParam("shortsId") int shortsId) {
//        try{
//            String authorizationHeader = request.getHeader("Authorization");
//            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
//                String jwtToken = authorizationHeader.substring(7).trim();
//                String email = JWTUtil.getEmail(jwtToken);
//                User user = userService.findByEmail(email);
//                if (user != null) {
//                    shortsService.deleteUserShortsScrap(user.getUserId(), shortsId);
//                    return ResponseEntity.status(HttpStatus.OK).body(user);
//                }
//                else {
//                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//                }
//            }
//            else {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization 헤더가 없거나 형식이 올바르지 않습니다. ");
//            }
//        }
//        catch (Exception e){
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }
//
//    @Operation(summary = "쇼츠 페이지", description = "쇼츠 페이지를 조회할 때 사용합니다. ")
//    @GetMapping("/{shortsId}")
//    public ResponseEntity<?> getShortsScrapDetails( @RequestParam("shortsId") int shortsId) {
//        try {
//            Map<String, Object> shortsDetails = shortsService.getShortsDetails(shortsId);
//            return ResponseEntity.status(HttpStatus.OK).body(shortsDetails);
//        }catch (Exception e){
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }
//}
