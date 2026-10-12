package com.example.noticeboard.dtos;

public class OnboardingDTOs {
    
    public record TraineeRegistrationRequest(
        String name,
        String email
    ) {}

    public record TraineeResponse(
        String id,
        String name,
        String email,
        String role,
        String status,
        String createdAt
    ) {}
}
