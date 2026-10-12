package com.example.noticeboard.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.noticeboard.dtos.OnboardingDTOs.TraineeRegistrationRequest;
import com.example.noticeboard.dtos.OnboardingDTOs.TraineeResponse;
import com.example.noticeboard.models.User;
import com.example.noticeboard.services.OnboardingService;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {
    private final OnboardingService onboardingService;

    public OnboardingController(OnboardingService onboardingService) {
        this.onboardingService = onboardingService;
    }

    @PostMapping("/trainees")
    public ResponseEntity<TraineeResponse> onboardTrainee(@RequestBody TraineeRegistrationRequest request) {
        TraineeResponse response = onboardingService.onboardSingleTrainee(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/trainees")
    public List<User> getAllTrainees() {
        return onboardingService.getAllTrainees();
    }
}
