package com.edtech.noticeboard.service;

import com.edtech.noticeboard.model.TrainingPlan;
import com.edtech.noticeboard.repository.TrainingPlanRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CurriculumServiceTest {

    @Mock
    private TrainingPlanRepository trainingPlanRepository;

    @InjectMocks
    private CurriculumService curriculumService;

    @Test
    void getAllTrainingPlans_returnsAllFromRepository() {
        TrainingPlan plan1 = new TrainingPlan();
        plan1.setId("1");
        plan1.setTitle("Onboarding Week 1");

        TrainingPlan plan2 = new TrainingPlan();
        plan2.setId("2");
        plan2.setTitle("Onboarding Week 2");

        when(trainingPlanRepository.findAll()).thenReturn(List.of(plan1, plan2));

        List<TrainingPlan> result = curriculumService.getAllTrainingPlans();

        assertThat(result).containsExactly(plan1, plan2);
    }

    @Test
    void getTrainingPlanById_notFound_throws404() {
        when(trainingPlanRepository.findById("missing-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> curriculumService.getTrainingPlanById("missing-id"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void createTrainingPlan_ignoresClientSuppliedId() {
        TrainingPlan input = new TrainingPlan();
        input.setId("client-supplied-id");
        input.setTitle("Onboarding Week 1");

        when(trainingPlanRepository.save(any(TrainingPlan.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        curriculumService.createTrainingPlan(input);

        ArgumentCaptor<TrainingPlan> captor = ArgumentCaptor.forClass(TrainingPlan.class);
        verify(trainingPlanRepository).save(captor.capture());
        assertThat(captor.getValue().getId()).isNull();
    }

    @Test
    void updateTrainingPlan_found_updatesFieldsAndSaves() {
        TrainingPlan existing = new TrainingPlan();
        existing.setId("123");
        existing.setTitle("Old Title");
        existing.setModules(List.of("Old Module"));
        existing.setMilestones(List.of("Old Milestone"));

        TrainingPlan updates = new TrainingPlan();
        updates.setTitle("New Title");
        updates.setModules(List.of("New Module"));
        updates.setMilestones(List.of("New Milestone"));

        when(trainingPlanRepository.findById("123")).thenReturn(Optional.of(existing));
        when(trainingPlanRepository.save(any(TrainingPlan.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TrainingPlan result = curriculumService.updateTrainingPlan("123", updates);

        assertThat(result.getId()).isEqualTo("123");
        assertThat(result.getTitle()).isEqualTo("New Title");
        assertThat(result.getModules()).containsExactly("New Module");
        assertThat(result.getMilestones()).containsExactly("New Milestone");
    }

    @Test
    void deleteTrainingPlan_notFound_throws404() {
        when(trainingPlanRepository.existsById("missing-id")).thenReturn(false);

        assertThatThrownBy(() -> curriculumService.deleteTrainingPlan("missing-id"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));

        verify(trainingPlanRepository, never()).deleteById(any());
    }
}
