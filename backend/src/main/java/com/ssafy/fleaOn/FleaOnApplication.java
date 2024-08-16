package com.ssafy.fleaOn;

import com.ssafy.fleaOn.web.config.JacksonConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@Import(JacksonConfig.class)
@EnableScheduling
public class FleaOnApplication {

	public static void main(String[] args) {
		SpringApplication.run(FleaOnApplication.class, args);
	}

}
