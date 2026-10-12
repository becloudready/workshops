package com.example.noticeboard.repos;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.noticeboard.models.User;

@Repository 
public class UserRepository {
    private final List<User> users = new ArrayList<>();
    
    public User onboardTrainee(User trainee) {
        users.add(trainee);
        return trainee;
    }

    public List<User> getAllTrainees() {
        return new ArrayList<>(users);
    }
}
