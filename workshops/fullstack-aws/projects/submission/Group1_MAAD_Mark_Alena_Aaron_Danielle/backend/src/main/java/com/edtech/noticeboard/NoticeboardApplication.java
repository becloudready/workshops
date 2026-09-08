package com.edtech.noticeboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NoticeboardApplication {

    public static void main(String[] args) {
        SpringApplication.run(NoticeboardApplication.class, args);
    }
}
