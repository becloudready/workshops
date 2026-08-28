package com.edtech.noticeboard.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "progress_logs")
public class ProgressLog {

    @Id
    private String id;

    private String traineeId;
    private String moduleId;
    private String status; // NOT_STARTED, IN_PROGRESS, BLOCKED, COMPLETED
    private String submissionNote;
    private Instant updatedAt;
}
