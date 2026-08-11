package com.cvsentricore.auth.controller;

import com.cvsentricore.auth.model.SecurityLog;
import com.cvsentricore.auth.repository.SecurityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class SecurityLogController {

    @Autowired
    private SecurityLogRepository logRepository;

    @PostMapping("/log")
    public ResponseEntity<SecurityLog> saveLog(@RequestBody SecurityLog log) {
        SecurityLog savedLog = logRepository.save(log);
        return ResponseEntity.ok(savedLog);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<SecurityLog>> getAllLogs() {
        return ResponseEntity.ok(logRepository.findAll());
    }
}