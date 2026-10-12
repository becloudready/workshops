package com.example.noticeboard.models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;

import com.example.noticeboard.enums.Role;
import com.example.noticeboard.enums.Status;

public class User {
    @Id 
    private String id;
    private String name;
    private String email;
    private Role role;
    private Status status;
    private LocalDateTime createdAt;

    public User() {
    }

    public User(String name, String email, Role role, Status status) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
