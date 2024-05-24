package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.model.Notification;
import com.sebastianportal.warehouseservice.model.User;
import com.sebastianportal.warehouseservice.repository.NotificationRepository;
import com.sebastianportal.warehouseservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private UserRepository userRepository;

    public void createNotificationForRole(String roleName, String message) {
        List<User> users = userRepository.findByRole_RoleName(roleName);
        for (User user : users) {
            Notification notification = new Notification();
            notification.setUserId(user.getUserId());
            notification.setMessage(message);
            notification.setIsRead(false);
            notification.setTimestamp(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsRead(userId, false);
    }
    public List<Notification> getReadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsRead(userId, true);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}
