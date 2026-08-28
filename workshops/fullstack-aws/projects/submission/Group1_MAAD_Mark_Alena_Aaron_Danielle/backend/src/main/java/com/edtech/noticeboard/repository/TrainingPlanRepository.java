package com.edtech.noticeboard.repository;

import com.edtech.noticeboard.model.TrainingPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TrainingPlanRepository extends MongoRepository<TrainingPlan, String> {
}
