package com.geekychads.noticeboardtracker.repos;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.geekychads.noticeboardtracker.models.Assignment;

public interface AssignmentRepository
        extends MongoRepository<Assignment, String> {
}