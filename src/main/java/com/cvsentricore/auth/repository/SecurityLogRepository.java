package com.cvsentricore.auth.repository;

import com.cvsentricore.auth.model.SecurityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityLogRepository extends JpaRepository<SecurityLog, Long> {
}