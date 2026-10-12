package com.example.noticeboard.exceptions;

public class TraineeAlreadyExistsException extends RuntimeException {
    public TraineeAlreadyExistsException(String email) {
        super("Trainee with email '" + email + "' is already registered.");
    }
}
