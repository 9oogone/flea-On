package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.dto.SummaryResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SummarizeService {

    @Value("${OPENAI_API_KEY}")
    private String apiKey;

    private static final String API_URL = "https://api.openai.com/v1/chat/completions";

    public SummaryResponse summarize(String text) {
        String systemInstruction = "assistant는 user의 입력을 다음 형식으로 요약해준다:\n"
                + "COMMEND: 상품에 대한 칭찬(50자 내외로 요약)\n"
                + "DESCRIPTION: 사진에 대한 요약적인 설명(50자 내외로 요약)\n"
                + "PERIOD: 사용 기간\n"
                + "STATUS: 상품의 전체적인 상태(50자 내외로 요약)";

        // JSON 객체 생성
        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-3.5-turbo");

        // messages 배열 구성
        JSONArray messages = new JSONArray();

        JSONObject systemMessage = new JSONObject();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemInstruction);
        messages.put(systemMessage);

        JSONObject userMessage = new JSONObject();
        userMessage.put("role", "user");
        userMessage.put("content", text);
        messages.put(userMessage);

        requestBody.put("messages", messages);

        // RestTemplate 생성 및 요청
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, entity, String.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                JSONObject responseJson = new JSONObject(response.getBody());
                String summaryContent = responseJson.getJSONArray("choices")
                        .getJSONObject(0)
                        .getJSONObject("message")
                        .getString("content");

                return parseSummaryContent(summaryContent);
            } else {
                // 에러 처리
                System.err.println("Error: " + response.getStatusCode() + " - " + response.getBody());
                return new SummaryResponse("요약을 생성하는 중 오류가 발생했습니다.", "", "", "");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new SummaryResponse("요약을 생성하는 중 예외가 발생했습니다.", "", "", "");
        }
    }

    private SummaryResponse parseSummaryContent(String summaryContent) {
        String commend = extractSection(summaryContent, "COMMEND");
        String description = extractSection(summaryContent, "DESCRIPTION");
        String period = extractSection(summaryContent, "PERIOD");
        String status = extractSection(summaryContent, "STATUS");

        return new SummaryResponse(commend, description, period, status);
    }

    private String extractSection(String content, String section) {
        String sectionHeader = section + ":";
        int startIndex = content.indexOf(sectionHeader);
        if (startIndex == -1) return "";

        startIndex += sectionHeader.length();
        int endIndex = content.indexOf("\n", startIndex);
        if (endIndex == -1) endIndex = content.length();

        return content.substring(startIndex, endIndex).trim();
    }
}