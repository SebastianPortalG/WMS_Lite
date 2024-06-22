package com.sebastianportal.warehouseservice.controller;

import com.sebastianportal.warehouseservice.config.JwtTokenProvider;
import com.sebastianportal.warehouseservice.dto.AdjustmentDto;
import com.sebastianportal.warehouseservice.dto.AdjustmentRequestDto;
import com.sebastianportal.warehouseservice.service.AdjustmentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/adjustment")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdjustmentController {

    @Autowired
    private AdjustmentService adjustmentService;
    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/request")
    public ResponseEntity<?> requestAdjustment(@RequestBody AdjustmentRequestDto requestDto, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String username = tokenProvider.getUserIdFromJWT(token);
        adjustmentService.requestAdjustment(requestDto, username);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/approve")
    public ResponseEntity<?> approveAdjustment(@RequestBody AdjustmentRequestDto requestDto, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String username = tokenProvider.getUserIdFromJWT(token);
        adjustmentService.approveAdjustment(requestDto, username);
        return ResponseEntity.ok().build();
    }
}