package com.example.noticeboard.services;

import java.util.List;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import com.example.noticeboard.dtos.OnboardingDTOs.TraineeRegistrationRequest;
import com.example.noticeboard.dtos.OnboardingDTOs.TraineeResponse;
import com.example.noticeboard.enums.Role;
import com.example.noticeboard.enums.Status;
import com.example.noticeboard.exceptions.TraineeAlreadyExistsException;
import com.example.noticeboard.models.User;
import com.example.noticeboard.repos.UserRepository;

@Service 
public class OnboardingService {
    private final UserRepository userRepository;

    public OnboardingService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public TraineeResponse onboardSingleTrainee(TraineeRegistrationRequest request) {
        User trainee = new User(request.name(), request.email(), Role.TRAINEE, Status.PENDING_ONBOARDING); 
        
        try {
            User saved = userRepository.onboardTrainee(trainee);
            return mapToResponse(saved);
        } catch (DuplicateKeyException e) {
            throw new TraineeAlreadyExistsException(request.email());
        }
    }

    public List<User> getAllTrainees() {
        return userRepository.getAllTrainees();
    }

    private TraineeResponse mapToResponse(User user) {
        return new TraineeResponse(
            user.getName(),
            user.getName(),
            user.getEmail(),
            user.getRole().name(),
            user.getStatus().name(),
            user.getCreatedAt().toString()
        );
    }
}
