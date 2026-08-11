package com.cvsentricore.auth.config;

import com.cvsentricore.auth.model.Role;
import com.cvsentricore.auth.model.User;
import com.cvsentricore.auth.repository.RoleRepository;
import com.cvsentricore.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Roles if they don't exist
        Role ownerRole = createRoleIfNotFound("ROLE_OWNER");
        Role securityRole = createRoleIfNotFound("ROLE_SECURITY");
        Role hrRole = createRoleIfNotFound("ROLE_HR");

        // 2. Seed a default Owner user if no users exist
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("owner_admin");
            admin.setEmail("admin@cvsentricore.com");
            admin.setPassword(passwordEncoder.encode("Admin@123")); // Hashed password
            admin.setFullName("System Owner");
            admin.setActive(true);

            Set<Role> roles = new HashSet<>();
            roles.add(ownerRole);
            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("--> Default OWNER user created: username [owner_admin], password [Admin@123]");
        }
    }

    private Role createRoleIfNotFound(String roleName) {
        return roleRepository.findByName(roleName).orElseGet(() -> {
            Role role = new Role();
            role.setName(roleName);
            return roleRepository.save(role);
        });
    }
}