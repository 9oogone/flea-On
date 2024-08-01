package com.ssafy.fleaOn;

import com.ssafy.fleaOn.web.config.JacksonConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(JacksonConfig.class)
public class FleaOnApplication {

	public static void main(String[] args) {
		SpringApplication.run(FleaOnApplication.class, args);
	}

}
