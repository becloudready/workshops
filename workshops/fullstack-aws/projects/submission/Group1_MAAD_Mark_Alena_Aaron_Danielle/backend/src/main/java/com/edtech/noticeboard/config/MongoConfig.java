package com.edtech.noticeboard.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.edtech.noticeboard.repository")
public class MongoConfig {
    // Connection details come from spring.data.mongodb.uri in application.properties
}
