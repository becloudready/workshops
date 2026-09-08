package com.edtech.noticeboard.repository;

import com.edtech.noticeboard.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}
