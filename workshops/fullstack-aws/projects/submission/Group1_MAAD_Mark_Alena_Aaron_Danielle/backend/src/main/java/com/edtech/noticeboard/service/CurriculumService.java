package com.edtech.noticeboard.service;

import com.edtech.noticeboard.model.TrainingPlan;
import com.edtech.noticeboard.repository.TrainingPlanRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CurriculumService {

    private final TrainingPlanRepository trainingPlanRepository;

    public CurriculumService(TrainingPlanRepository trainingPlanRepository) {
        this.trainingPlanRepository = trainingPlanRepository;
    }

    public List<TrainingPlan> getAllTrainingPlans() {
        return trainingPlanRepository.findAll();
    }

    public TrainingPlan getTrainingPlanById(String id) {
        return trainingPlanRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Training plan not found: " + id));
    }

    public TrainingPlan createTrainingPlan(TrainingPlan trainingPlan) {
        trainingPlan.setId(null);
        return trainingPlanRepository.save(trainingPlan);
    }

    public TrainingPlan updateTrainingPlan(String id, TrainingPlan updated) {
        TrainingPlan existing = getTrainingPlanById(id);
        existing.setTitle(updated.getTitle());
        existing.setModules(updated.getModules());
        existing.setMilestones(updated.getMilestones());
        return trainingPlanRepository.save(existing);
    }

    public void deleteTrainingPlan(String id) {
        if (!trainingPlanRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Training plan not found: " + id);
        }
        trainingPlanRepository.deleteById(id);
    }
}
