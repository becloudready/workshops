package com.edtech.noticeboard.repository;

import com.edtech.noticeboard.model.Cohort;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CohortRepository extends MongoRepository<Cohort, String> {
}
