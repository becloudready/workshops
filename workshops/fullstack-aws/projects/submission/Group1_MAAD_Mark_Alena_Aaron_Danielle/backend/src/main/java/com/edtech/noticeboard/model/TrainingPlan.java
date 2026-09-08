package com.edtech.noticeboard.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "training_plans")
public class TrainingPlan {

    @Id
    private String id;

    @NotBlank
    private String title;

    private List<String> modules;
    private List<String> milestones;
}
