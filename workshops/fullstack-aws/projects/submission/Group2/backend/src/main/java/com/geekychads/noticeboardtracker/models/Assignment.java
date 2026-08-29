package com.geekychads.noticeboardtracker.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "assignments")
public class Assignment {

    @Id
    private String assignmentId;

    private String assignmentName;
    private int numberOfSteps;
    private String status;

    public Assignment() {
    }

    public Assignment(
            String assignmentId,
            String assignmentName,
            int numberOfSteps,
            String status) {

        this.assignmentId = assignmentId;
        this.assignmentName = assignmentName;
        this.numberOfSteps = numberOfSteps;
        this.status = status;
    }

    public String getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(String assignmentId) {
        this.assignmentId = assignmentId;
    }

    public String getAssignmentName() {
        return assignmentName;
    }

    public void setAssignmentName(String assignmentName) {
        this.assignmentName = assignmentName;
    }

    public int getNumberOfSteps() {
        return numberOfSteps;
    }

    public void setNumberOfSteps(int numberOfSteps) {
        this.numberOfSteps = numberOfSteps;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}