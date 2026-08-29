package com.geekychads.noticeboardtracker.repos;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.geekychads.noticeboardtracker.models.TrainingPlan;

public interface TrainingPlanRepository
        extends MongoRepository<TrainingPlan, String> {
}