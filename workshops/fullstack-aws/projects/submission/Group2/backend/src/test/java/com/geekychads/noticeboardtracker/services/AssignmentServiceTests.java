package com.geekychads.noticeboardtracker.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.geekychads.noticeboardtracker.models.Assignment;
import com.geekychads.noticeboardtracker.repos.AssignmentRepository;

@ExtendWith(MockitoExtension.class)
class AssignmentServiceTests {

    @Mock
    private AssignmentRepository assignmentRepository;

    @InjectMocks
    private AssignmentService assignmentService;

    @Test
    void shouldReturnAllAssignments() {
        Assignment assignment = new Assignment(
                "assignment1",
                "Java Basics",
                5,
                "INCOMPLETE");

        when(assignmentRepository.findAll())
                .thenReturn(List.of(assignment));

        List<Assignment> result =
                assignmentService.getAllAssignments();

        assertEquals(1, result.size());
        assertEquals(
                "Java Basics",
                result.get(0).getAssignmentName());
    }

    @Test
    void shouldCreateAssignment() {
        Assignment assignment = new Assignment(
                null,
                "Spring Boot API",
                4,
                "INCOMPLETE");

        when(assignmentRepository.save(assignment))
                .thenReturn(assignment);

        Assignment result =
                assignmentService.createAssignment(assignment);

        assertEquals(
                "Spring Boot API",
                result.getAssignmentName());

        assertEquals(4, result.getNumberOfSteps());
        verify(assignmentRepository).save(assignment);
    }

    @Test
    void shouldReturnAssignmentById() {
        Assignment assignment = new Assignment(
                "assignment1",
                "MongoDB Basics",
                3,
                "INCOMPLETE");

        when(assignmentRepository.findById("assignment1"))
                .thenReturn(Optional.of(assignment));

        Optional<Assignment> result =
                assignmentService.getAssignmentById("assignment1");

        assertTrue(result.isPresent());
        assertEquals(
                "MongoDB Basics",
                result.get().getAssignmentName());
    }

    @Test
    void shouldUpdateAssignment() {
        Assignment existingAssignment = new Assignment(
                "assignment1",
                "Old Name",
                2,
                "INCOMPLETE");

        Assignment updatedAssignment = new Assignment(
                "assignment1",
                "Updated Name",
                5,
                "COMPLETE");

        when(assignmentRepository.findById("assignment1"))
                .thenReturn(Optional.of(existingAssignment));

        when(assignmentRepository.save(existingAssignment))
                .thenReturn(existingAssignment);

        Optional<Assignment> result =
                assignmentService.updateAssignment(
                        "assignment1", updatedAssignment);

        assertTrue(result.isPresent());
        assertEquals(
                "Updated Name",
                result.get().getAssignmentName());

        assertEquals(5, result.get().getNumberOfSteps());
        assertEquals("COMPLETE", result.get().getStatus());
    }

    @Test
    void shouldDeleteExistingAssignment() {
        when(assignmentRepository.existsById("assignment1"))
                .thenReturn(true);

        boolean result =
                assignmentService.deleteAssignment("assignment1");

        assertTrue(result);
        verify(assignmentRepository).deleteById("assignment1");
    }
}