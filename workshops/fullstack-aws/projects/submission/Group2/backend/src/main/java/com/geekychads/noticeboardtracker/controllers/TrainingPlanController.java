package com.geekychads.noticeboardtracker.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.geekychads.noticeboardtracker.models.TrainingPlan;
import com.geekychads.noticeboardtracker.services.TrainingPlanService;

@RestController
@RequestMapping("/training-plans")
public class TrainingPlanController {

    private final TrainingPlanService trainingPlanService;

    public TrainingPlanController(TrainingPlanService trainingPlanService) {
        this.trainingPlanService = trainingPlanService;
    }

    @GetMapping
    public List<TrainingPlan> getAllTrainingPlans() {
        return trainingPlanService.getAllTrainingPlans();
    }

    @GetMapping("/{planId}")
    public ResponseEntity<TrainingPlan> getTrainingPlanById(
            @PathVariable String planId) {

        return trainingPlanService.getTrainingPlanById(planId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TrainingPlan> createTrainingPlan(
            @RequestBody TrainingPlan trainingPlan) {

        TrainingPlan createdPlan =
                trainingPlanService.createTrainingPlan(trainingPlan);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
    }

    @PutMapping("/{planId}")
    public ResponseEntity<TrainingPlan> updateTrainingPlan(
            @PathVariable String planId,
            @RequestBody TrainingPlan trainingPlan) {

        return trainingPlanService.updateTrainingPlan(planId, trainingPlan)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{planId}")
    public ResponseEntity<Void> deleteTrainingPlan(
            @PathVariable String planId) {

        boolean deleted = trainingPlanService.deleteTrainingPlan(planId);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{planId}/assignments")
    public ResponseEntity<List<String>> getAssignments(
            @PathVariable String planId) {

        return trainingPlanService.getAssignments(planId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{planId}/assignments")
    public ResponseEntity<TrainingPlan> addAssignment(
            @PathVariable String planId,
            @RequestBody Map<String, String> request) {

        String assignmentId = request.get("assignmentId");

        if (assignmentId == null || assignmentId.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        return trainingPlanService.addAssignment(planId, assignmentId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{planId}/assignments/{assignmentId}")
    public ResponseEntity<Void> removeAssignment(
            @PathVariable String planId,
            @PathVariable String assignmentId) {

        if (trainingPlanService
                .removeAssignment(planId, assignmentId)
                .isEmpty()) {

            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}