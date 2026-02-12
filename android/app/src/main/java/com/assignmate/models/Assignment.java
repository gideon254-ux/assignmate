package com.assignmate.models;

import com.google.firebase.Timestamp;
import java.util.Date;

public class Assignment {
    private String id;
    private String title;
    private String description;
    private String subject;
    private Date dueDate;
    private String priority;
    private String status;
    private String userId;
    private Date createdAt;
    private Date updatedAt;

    public Assignment() {
        // Required for Firestore
    }

    public Assignment(String title, String description, String subject, Date dueDate, String priority) {
        this.title = title;
        this.description = description;
        this.subject = subject;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = "pending";
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Date getDueDate() { return dueDate; }
    public void setDueDate(Date dueDate) { this.dueDate = dueDate; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public boolean isOverdue() {
        return !status.equals("completed") && dueDate.before(new Date());
    }
}