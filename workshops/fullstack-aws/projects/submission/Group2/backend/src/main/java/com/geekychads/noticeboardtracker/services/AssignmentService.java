package com.geekychads.noticeboardtracker.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.geekychads.noticeboardtracker.models.Assignment;
import com.geekychads.noticeboardtracker.repos.AssignmentRepository;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

    public AssignmentService(
            AssignmentRepository assignmentRepository) {

        this.assignmentRepository = assignmentRepository;
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Optional<Assignment> getAssignmentById(
            String assignmentId) {

        return assignmentRepository.findById(assignmentId);
    }

    public Assignment createAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public Optional<Assignment> updateAssignment(
            String assignmentId,
            Assignment updatedAssignment) {

        return assignmentRepository.findById(assignmentId)
                .map(existingAssignment -> {
                    existingAssignment.setAssignmentName(
                            updatedAssignment.getAssignmentName());

                    existingAssignment.setNumberOfSteps(
                            updatedAssignment.getNumberOfSteps());

                    existingAssignment.setStatus(
                            updatedAssignment.getStatus());

                    return assignmentRepository.save(
                            existingAssignment);
                });
    }

    public boolean deleteAssignment(String assignmentId) {
        if (!assignmentRepository.existsById(assignmentId)) {
            return false;
        }

        assignmentRepository.deleteById(assignmentId);
        return true;
    }
}