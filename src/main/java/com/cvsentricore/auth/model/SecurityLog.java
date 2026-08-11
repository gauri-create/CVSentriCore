package com.cvsentricore.auth.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "security_logs")
public class SecurityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String status;
    private String type;
    private LocalDateTime timestamp = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}