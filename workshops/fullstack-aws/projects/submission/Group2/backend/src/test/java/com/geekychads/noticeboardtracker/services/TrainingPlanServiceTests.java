package com.geekychads.noticeboardtracker.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.geekychads.noticeboardtracker.models.TrainingPlan;
import com.geekychads.noticeboardtracker.repos.TrainingPlanRepository;

@ExtendWith(MockitoExtension.class)
class TrainingPlanServiceTests {

    @Mock
    private TrainingPlanRepository trainingPlanRepository;

    @InjectMocks
    private TrainingPlanService trainingPlanService;

    @Test
    void shouldReturnAllTrainingPlans() {
        TrainingPlan plan = new TrainingPlan(
                "plan1",
                "Java Full Stack",
                List.of("assignment1"),
                "INCOMPLETE");

        when(trainingPlanRepository.findAll()).thenReturn(List.of(plan));

        List<TrainingPlan> result =
                trainingPlanService.getAllTrainingPlans();

        assertEquals(1, result.size());
        assertEquals("plan1", result.get(0).getPlanId());
        assertEquals(
                "Java Full Stack",
                result.get(0).getPlanName());
    }

    @Test
    void shouldCreateTrainingPlan() {
        TrainingPlan plan = new TrainingPlan(
                null,
                "Java Full Stack",
                List.of("assignment1"),
                "INCOMPLETE");

        when(trainingPlanRepository.save(plan)).thenReturn(plan);

        TrainingPlan result =
                trainingPlanService.createTrainingPlan(plan);

        assertEquals("Java Full Stack", result.getPlanName());
        assertEquals("INCOMPLETE", result.getStatus());
        verify(trainingPlanRepository).save(plan);
    }

    @Test
    void shouldUpdateTrainingPlan() {
        TrainingPlan existingPlan = new TrainingPlan(
                "plan1",
                "Old Plan Name",
                new ArrayList<>(List.of("assignment1")),
                "INCOMPLETE");

        TrainingPlan updatedPlan = new TrainingPlan(
                "plan1",
                "Updated Plan Name",
                List.of("assignment1", "assignment2"),
                "COMPLETE");

        when(trainingPlanRepository.findById("plan1"))
                .thenReturn(Optional.of(existingPlan));

        when(trainingPlanRepository.save(existingPlan))
                .thenReturn(existingPlan);

        Optional<TrainingPlan> result =
                trainingPlanService.updateTrainingPlan(
                        "plan1", updatedPlan);

        assertTrue(result.isPresent());
        assertEquals(
                "Updated Plan Name",
                result.get().getPlanName());
        assertEquals("COMPLETE", result.get().getStatus());
        assertEquals(2, result.get().getAssignments().size());
    }

    @Test
    void shouldDeleteExistingTrainingPlan() {
        when(trainingPlanRepository.existsById("plan1"))
                .thenReturn(true);

        boolean result =
                trainingPlanService.deleteTrainingPlan("plan1");

        assertTrue(result);
        verify(trainingPlanRepository).deleteById("plan1");
    }

    @Test
    void shouldAddAssignmentToTrainingPlan() {
        TrainingPlan plan = new TrainingPlan(
                "plan1",
                "Java Full Stack",
                new ArrayList<>(),
                "INCOMPLETE");

        when(trainingPlanRepository.findById("plan1"))
                .thenReturn(Optional.of(plan));

        when(trainingPlanRepository.save(plan)).thenReturn(plan);

        Optional<TrainingPlan> result =
                trainingPlanService.addAssignment(
                        "plan1", "assignment1");

        assertTrue(result.isPresent());
        assertEquals(
                List.of("assignment1"),
                result.get().getAssignments());
    }
}