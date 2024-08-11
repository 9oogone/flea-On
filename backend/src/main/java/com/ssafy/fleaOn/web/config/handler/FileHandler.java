package com.ssafy.fleaOn.web.config.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class FileHandler {

    // 기본 저장 경로를 /opt/openvidu/recordings/live/로 설정
    private static final String BASE_PATH = "/opt/openvidu/recordings/live";

    public String parseFileInfo(MultipartFile multipartFile) throws Exception {
        try {
            // 전달되어 온 파일이 존재할 경우
            System.out.println("MultipartFile: " + multipartFile);
            if (multipartFile == null || multipartFile.isEmpty()) {
                System.out.println("파일이 없거나 빈 파일입니다.");
                return null;
            }

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
                System.out.println("디렉토리가 존재하지 않음. 새로 생성합니다: " + path);
                boolean wasSuccessful = directory.mkdirs();
                if (!wasSuccessful) {
                    throw new Exception("파일 디렉토리 생성에 실패했습니다.");
                }
                System.out.println("디렉토리 생성 성공: " + path);
            } else {
                System.out.println("디렉토리가 이미 존재합니다: " + path);
            }

            // 파일의 확장자 추출
            String contentType = multipartFile.getContentType();
            if (contentType == null) {
                throw new Exception("파일의 Content-Type을 확인할 수 없습니다.");
            }
            if (contentType.contains("image/jpeg")) {
                originalFileExtension = ".jpg";
            } else if (contentType.contains("image/png")) {
                originalFileExtension = ".png";
            } else {
                // 처리할 수 없는 파일 형식인 경우
                throw new Exception("지원하지 않는 파일 형식입니다: " + contentType);
            }

            // 파일명 중복 피하고자 나노초까지 얻어와 지정
            String newFileName = System.nanoTime() + originalFileExtension;

            // 업로드 한 파일 데이터를 지정한 파일에 저장
            String filePath = path + File.separator + newFileName;
            File file = new File(filePath);
            System.out.println("파일을 저장할 경로: " + filePath);
            try {
                multipartFile.transferTo(file);
            } catch (Exception e) {
                throw new Exception("파일 저장 중 오류가 발생했습니다.", e);
            }

            // 파일 권한 설정(쓰기, 읽기)
            file.setWritable(true);
            file.setReadable(true);
            System.out.println("파일 권한 설정 완료: 읽기 = " + file.canRead() + ", 쓰기 = " + file.canWrite());

            // 파일 존재 여부 확인
            if (file.exists()) {
                System.out.println("파일 저장 성공: " + filePath);
            } else {
                System.out.println("파일이 저장되지 않았습니다.");
                throw new Exception("파일 저장에 실패했습니다: " + filePath);
            }

            // 파일 경로 반환
            return filePath;

        } catch (Exception e) {
            System.err.println("파일 처리 중 예외 발생: " + e.getMessage());
            e.printStackTrace();
            throw e; // 예외를 다시 던져 호출한 메서드로 전달
        }
    }
}
