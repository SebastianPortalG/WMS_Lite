package com.sebastianportal.warehouseservice.controller;

import com.sebastianportal.warehouseservice.config.JwtTokenProvider;
import com.sebastianportal.warehouseservice.model.Notification;
import com.sebastianportal.warehouseservice.model.User;
import com.sebastianportal.warehouseservice.service.NotificationService;
import com.sebastianportal.warehouseservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    @Autowired
    private JwtTokenProvider tokenProvider;
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getNotifications(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String username = tokenProvider.getUserIdFromJWT(token);
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found.");
        }
        List<Notification> notifications = notificationService.getUnreadNotifications(Long.valueOf(user.getUserId()));
        return ResponseEntity.ok(notifications);
    }
    @GetMapping("/read")
    public ResponseEntity<?> getReadNotifications(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String username = tokenProvider.getUserIdFromJWT(token);
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found.");
        }
        List<Notification> notifications = notificationService.getReadNotifications(Long.valueOf(user.getUserId()));
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
