package com.edtech.noticeboard.repository;

import com.edtech.noticeboard.model.ProgressLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProgressLogRepository extends MongoRepository<ProgressLog, String> {
    List<ProgressLog> findByStatus(String status);
}
