package com.geekychads.noticeboardtracker.models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "training_plans")
public class TrainingPlan {

    @Id
    private String planId;

    private String planName;
    private List<String> assignments;
    private String status;

    public TrainingPlan() {
    }

    public TrainingPlan(
            String planId,
            String planName,
            List<String> assignments,
            String status) {

        this.planId = planId;
        this.planName = planName;
        this.assignments = assignments;
        this.status = status;
    }

    public String getPlanId() {
        return planId;
    }

    public void setPlanId(String planId) {
        this.planId = planId;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public List<String> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<String> assignments) {
        this.assignments = assignments;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}