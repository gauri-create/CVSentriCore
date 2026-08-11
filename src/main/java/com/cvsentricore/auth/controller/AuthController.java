package com.cvsentricore.auth.controller;

import com.cvsentricore.auth.dto.LoginRequest;
import com.cvsentricore.auth.dto.LoginResponse;
import com.cvsentricore.auth.model.Role;
import com.cvsentricore.auth.model.User;
import com.cvsentricore.auth.repository.RoleRepository;
import com.cvsentricore.auth.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Extract roles from authenticated user
        Set<String> roles = authentication.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toSet());

        return ResponseEntity.ok(new LoginResponse("Login successful!", loginRequest.getUsername(), roles));
    }

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerUser(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam("fullName") String fullName,
            @RequestParam("role") String roleName,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {

        // Validate uniqueness
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already in use!"));
        }

        String profilePicturePath = null;

        // Handle profile picture file storage if provided
        if (profilePicture != null && !profilePicture.isEmpty()) {
            try {
                String uploadDir = "uploads/";
                File directory = new File(uploadDir);
                if (!directory.exists()) {
                    directory.mkdirs();
                }
                
                String fileName = UUID.randomUUID().toString() + "_" + profilePicture.getOriginalFilename();
                Path filePath = Paths.get(uploadDir + fileName);
                Files.write(filePath, profilePicture.getBytes());
                
                profilePicturePath = "/uploads/" + fileName;
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("message", "Error saving profile picture: " + e.getMessage()));
            }
        }

        // Fetch or create the target role
        Role userRole = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(null, roleName)));

        // Create the new user
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setEmail(email);
        newUser.setFullName(fullName);
        newUser.setActive(true);
        newUser.setRoles(Set.of(userRole));
        // If your User model has a field for profile picture, set it here:
        // newUser.setProfilePicture(profilePicturePath);

        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("message", "User successfully registered with role " + roleName));
    }
}