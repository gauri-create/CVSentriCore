package com.cvsentricore.auth.controller;

import com.cvsentricore.auth.model.Employee;
import com.cvsentricore.auth.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping("/sync")
    public ResponseEntity<List<Employee>> getEmployeesForAI() {
        return ResponseEntity.ok(employeeRepository.findAll());
    }
}