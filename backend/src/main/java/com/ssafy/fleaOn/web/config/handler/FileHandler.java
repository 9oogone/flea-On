package com.ssafy.fleaOn.web.config.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class FileHandler {

    // 기본 저장 경로를 /opt/openvidu/recordings/live/로 설정
    private static final String BASE_PATH = "/opt/openvidu/recordings/live/";
    private static final String RETURN_PATH = "https://i11b202.p.ssafy.io/openvidu/recordings/live/";
    public String parseFileInfo(MultipartFile multipartFile) throws Exception {
        // 전달되어 온 파일이 존재할 경우
        System.out.println(multipartFile);
        System.out.println(multipartFile.isEmpty());
        System.out.println(multipartFile != null);
        if (multipartFile != null) {
            System.out.println("파일 이름: " + multipartFile.getOriginalFilename());
            System.out.println("파일 크기: " + multipartFile.getSize());
            System.out.println("Content-Type: " + multipartFile.getContentType());

            String originalFileExtension = null;
            String path = null;

            // 파일명을 업로드한 날짜로 변환하여 저장
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
            String currentDate = now.format(dateTimeFormatter);

            // 파일을 저장할 세부 경로 지정
            path = BASE_PATH + currentDate;
            File directory = new File(path);

            // 디렉토리가 존재하지 않을 경우 생성
            if (!directory.exists()) {
                boolean wasSuccessful = directory.mkdirs();
                if (!wasSuccessful) {
                    throw new Exception("파일 디렉토리 생성에 실패했습니다.");
                }
            }

            // 파일의 확장자 추출
            String contentType = multipartFile.getContentType();
            if (contentType.contains("image/jpeg")) {
                originalFileExtension = ".jpg";
            } else if (contentType.contains("image/png")) {
                originalFileExtension = ".png";
            } else {
                // 처리할 수 없는 파일 형식인 경우
                throw new Exception("지원하지 않는 파일 형식입니다.");
            }

            // 파일명 중복 피하고자 나노초까지 얻어와 지정
            String newFileName = System.nanoTime() + originalFileExtension;

            // 업로드 한 파일 데이터를 지정한 파일에 저장
            String filePath = path + File.separator + newFileName;
            File file = new File(filePath);
            multipartFile.transferTo(file);

            // 파일 권한 설정(쓰기, 읽기)
            file.setWritable(true);
            file.setReadable(true);

            System.out.println("파일 저장 성공: " + filePath);

            // 파일 경로 반환
            return RETURN_PATH+currentDate+File.separator+newFileName;
        } else {
            System.out.println("파일이 없습니다.");
            // 파일이 없을 경우 null 반환
            return "https://i11b202.p.ssafy.io/openvidu/recordings/live/sampleImage.png";
        }
    }
}
