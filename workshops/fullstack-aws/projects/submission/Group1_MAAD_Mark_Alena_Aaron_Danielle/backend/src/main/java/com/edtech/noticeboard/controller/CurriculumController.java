package com.edtech.noticeboard.controller;

import com.edtech.noticeboard.model.TrainingPlan;
import com.edtech.noticeboard.service.CurriculumService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/curriculum")
public class CurriculumController {

    private final CurriculumService curriculumService;

    public CurriculumController(CurriculumService curriculumService) {
        this.curriculumService = curriculumService;
    }

    @GetMapping
    public List<TrainingPlan> getAll() {
        return curriculumService.getAllTrainingPlans();
    }

    @GetMapping("/{id}")
    public TrainingPlan getById(@PathVariable String id) {
        return curriculumService.getTrainingPlanById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TrainingPlan create(@Valid @RequestBody TrainingPlan trainingPlan) {
        return curriculumService.createTrainingPlan(trainingPlan);
    }

    @PutMapping("/{id}")
    public TrainingPlan update(@PathVariable String id, @Valid @RequestBody TrainingPlan trainingPlan) {
        return curriculumService.updateTrainingPlan(id, trainingPlan);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        curriculumService.deleteTrainingPlan(id);
    }
}
