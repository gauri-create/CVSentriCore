package com.cvsentricore.auth.dto;

import java.util.Set;

public class LoginResponse {
    private String message;
    private String username;
    private Set<String> roles;

    public LoginResponse(String message, String username, Set<String> roles) {
        this.message = message;
        this.username = username;
        this.roles = roles;
    }

    // Getters and Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}