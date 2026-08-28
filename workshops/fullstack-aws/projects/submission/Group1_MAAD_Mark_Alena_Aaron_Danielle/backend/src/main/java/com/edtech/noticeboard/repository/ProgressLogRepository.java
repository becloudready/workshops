package com.edtech.noticeboard.repository;

import com.edtech.noticeboard.model.ProgressLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProgressLogRepository extends MongoRepository<ProgressLog, String> {
}
