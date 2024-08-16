package com.ssafy.fleaOn.web.config.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    // JSON 변환 관련 예외 처리
    @ExceptionHandler(value = {HttpMessageNotReadableException.class})
    public ResponseEntity<Object> handleConversionError(HttpMessageNotReadableException ex, WebRequest request) {
        return new ResponseEntity<>("JSON 파싱 오류: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // 일반적인 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneralException(Exception ex, WebRequest request) {
        return new ResponseEntity<>("서버 오류: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 여기에 추가적인 예외 처리 메소드를 정의할 수 있습니다.
}
