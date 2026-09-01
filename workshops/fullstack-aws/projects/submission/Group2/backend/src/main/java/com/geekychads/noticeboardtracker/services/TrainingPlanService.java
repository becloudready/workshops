package com.geekychads.noticeboardtracker.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.geekychads.noticeboardtracker.models.TrainingPlan;
import com.geekychads.noticeboardtracker.repos.TrainingPlanRepository;

@Service
public class TrainingPlanService {

    private final TrainingPlanRepository trainingPlanRepository;

    public TrainingPlanService(TrainingPlanRepository trainingPlanRepository) {
        this.trainingPlanRepository = trainingPlanRepository;
    }

    public List<TrainingPlan> getAllTrainingPlans() {
        return trainingPlanRepository.findAll();
    }

    public Optional<TrainingPlan> getTrainingPlanById(String planId) {
        return trainingPlanRepository.findById(planId);
    }

    public TrainingPlan createTrainingPlan(TrainingPlan trainingPlan) {
        return trainingPlanRepository.save(trainingPlan);
    }

    public Optional<TrainingPlan> updateTrainingPlan(
            String planId, TrainingPlan updatedPlan) {

        return trainingPlanRepository.findById(planId)
                .map(existingPlan -> {
                    existingPlan.setPlanName(updatedPlan.getPlanName());
                    existingPlan.setAssignments(updatedPlan.getAssignments());
                    existingPlan.setStatus(updatedPlan.getStatus());
                    return trainingPlanRepository.save(existingPlan);
                });
    }

    public boolean deleteTrainingPlan(String planId) {
        if (!trainingPlanRepository.existsById(planId)) {
            return false;
        }

        trainingPlanRepository.deleteById(planId);
        return true;
    }

    public Optional<List<String>> getAssignments(String planId) {
        return trainingPlanRepository.findById(planId)
                .map(plan -> plan.getAssignments() == null
                        ? List.of()
                        : plan.getAssignments());
    }

    public Optional<TrainingPlan> addAssignment(
            String planId, String assignmentId) {

        return trainingPlanRepository.findById(planId)
                .map(plan -> {
                    if (plan.getAssignments() == null) {
                        plan.setAssignments(new ArrayList<>());
                    }

                    if (!plan.getAssignments().contains(assignmentId)) {
                        plan.getAssignments().add(assignmentId);
                    }

                    return trainingPlanRepository.save(plan);
                });
    }

    public Optional<TrainingPlan> removeAssignment(
            String planId, String assignmentId) {

        return trainingPlanRepository.findById(planId)
                .map(plan -> {
                    if (plan.getAssignments() != null) {
                        plan.getAssignments().remove(assignmentId);
                    }

                    return trainingPlanRepository.save(plan);
                });
    }
}