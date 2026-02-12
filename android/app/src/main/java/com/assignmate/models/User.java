package com.assignmate.models;

import java.util.Date;

public class User {
    private String id;
    private String email;
    private String name;
    private boolean isAdmin;
    private Date createdAt;
    private Date lastLoginAt;
    private int assignmentCount;

    public User() {
        // Required for Firestore
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isAdmin() { return isAdmin; }
    public void setAdmin(boolean admin) { isAdmin = admin; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(Date lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public int getAssignmentCount() { return assignmentCount; }
    public void setAssignmentCount(int assignmentCount) { this.assignmentCount = assignmentCount; }
}