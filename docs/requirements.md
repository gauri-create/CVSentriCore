# CVSentriCore - System Requirements & Expectations

## 1. Functional Requirements
- **FR-01: Role-Based Access Control (RBAC):** The system must support three distinct user roles: `ROLE_OWNER`, `ROLE_SECURITY`, and `ROLE_HR`.
- **FR-02: User Authentication:** Users must log in via secure credentials (username/password) hashed using BCrypt.
- **FR-03: Member Enrollment (HR Portal):** HR staff must be able to register authorized employees, capturing their department data and uploading reference face photos (`authorized_faces`).
- **FR-04: Live Ingestion & Frame Processing (Demo Mode):** The system must interface with a local webcam/CCTV simulation feed to capture continuous frames.
- **FR-05: Facial Recognition & Matching:** Incoming frames must be evaluated against the registered member database. Unrecognized faces must trigger an unknown person detection workflow.
- **FR-06: Real-Time Alerts:** Upon unknown person confirmation, a WebSocket alert must push instantly to the Security Team dashboard.
- **FR-07: Automated Incident Reporting:** The system must capture an intruder snapshot, record the timestamp, compile metadata, and create a persistent record in `incident_reports`.

## 2. Non-Functional Requirements & Expectations
- **NFR-01: Modularity (Modular Monolith):** Code must be structured into independent packages to isolate concerns and ease future migration to microservices.
- **NFR-02: Extensibility:** Video sources (webcam vs. RTSP stream) and CV engines must be abstracted behind interfaces (Strategy Pattern) to prevent tightly-coupled code.
- **NFR-03: Database Agnosticism:** Data operations must rely entirely on Spring Data JPA / Hibernate to allow swapping relational databases (MySQL to PostgreSQL) via configuration files alone.
- **NFR-04: Asynchronous Processing:** Frame capture, matching, and notification events must execute asynchronously to prevent blocking REST APIs or lagging the UI.