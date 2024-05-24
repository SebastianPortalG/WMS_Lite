package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndIsRead(Long userId, boolean isRead);
}
