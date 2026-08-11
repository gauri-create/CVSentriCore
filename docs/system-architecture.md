# CVSentriCore - System Architecture & Database Design

## 1. Architectural Overview
CVSentriCore follows a layered **Modular Monolith** pattern in Spring Boot 3.x. 
- **Presentation / API Layer:** Exposes secured REST endpoints and WebSocket channels.
- **Service Layer:** Houses modular business logic for authentication, computer vision processing, and report generation.
- **Persistence Layer:** Communicates with MySQL via Spring Data JPA.

## 2. Relational Database Schema (MySQL)
- **`roles`**: Stores available system permissions (`ROLE_OWNER`, `ROLE_SECURITY`, `ROLE_HR`).
- **`users`**: Stores user credentials, hashed passwords, and statuses.
- **`user_roles`**: Maps users to roles in a many-to-many relationship.
- **`authorized_faces`**: Tracks authorized individuals registered by HR personnel, referencing profile images.
- **`incident_reports`**: Preserves intruder snapshot paths, timestamp metadata, investigation status, and resolution assignments.