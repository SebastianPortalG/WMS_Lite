package com.sebastianportal.warehouseservice.controller;

import com.sebastianportal.warehouseservice.config.JwtTokenProvider;
import com.sebastianportal.warehouseservice.dto.InventoryComparisonDto;
import com.sebastianportal.warehouseservice.service.InventoryComparisonService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory-comparison")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class InventoryComparisonController {
    @Autowired
    private InventoryComparisonService inventoryComparisonService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @GetMapping("/compare/{inventoryMasterId}")
    public ResponseEntity<List<InventoryComparisonDto>> compareInventory(@PathVariable Integer inventoryMasterId, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String username = tokenProvider.getUserIdFromJWT(token);

        List<InventoryComparisonDto> comparison = inventoryComparisonService.compareInventory(inventoryMasterId, username);
        return ResponseEntity.ok(comparison);
    }
}
