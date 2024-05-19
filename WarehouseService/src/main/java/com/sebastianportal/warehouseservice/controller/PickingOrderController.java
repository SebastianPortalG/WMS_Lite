package com.sebastianportal.warehouseservice.controller;

import com.sebastianportal.warehouseservice.config.JwtTokenProvider;
import com.sebastianportal.warehouseservice.dto.BasicCreationResponseDto;
import com.sebastianportal.warehouseservice.dto.PickingOrderCreationDto;
import com.sebastianportal.warehouseservice.dto.PickingOrderDetailResponseDto;
import com.sebastianportal.warehouseservice.dto.PickingOrderMinimalDto;
import com.sebastianportal.warehouseservice.model.PickingOrder;
import com.sebastianportal.warehouseservice.model.PickingOrderDetail;
import com.sebastianportal.warehouseservice.model.User;
import com.sebastianportal.warehouseservice.service.PickingOrderService;
import com.sebastianportal.warehouseservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/picking-orders")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PickingOrderController {

    @Autowired
    private PickingOrderService pickingOrderService;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping
    public ResponseEntity<?> createPickingOrder(HttpServletRequest request, @RequestBody PickingOrderCreationDto dto) {
        try {
            String authToken = request.getHeader("Authorization");
            if (authToken == null || !authToken.startsWith("Bearer ")) {
                return ResponseEntity.status(403).body("Authorization token is missing or invalid.");
            }
            String username = tokenProvider.getUserIdFromJWT(authToken.substring(7));
            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found.");
            }

            PickingOrder savedPickingOrder = pickingOrderService.createPickingOrder(user, dto);
            BasicCreationResponseDto responseDto = new BasicCreationResponseDto(savedPickingOrder.getPickingOrderId(), "Picking order created successfully");
            return ResponseEntity.status(201).body(responseDto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{pickingOrderId}/details")
    public ResponseEntity<PickingOrderDetail> addPickingOrderDetail(@PathVariable Integer pickingOrderId, @RequestBody PickingOrderDetail pickingOrderDetail) {
        pickingOrderDetail.setPickingOrder(pickingOrderService.findById(pickingOrderId));
        PickingOrderDetail savedDetail = pickingOrderService.savePickingOrderDetail(pickingOrderDetail);
        return ResponseEntity.ok(savedDetail);
    }

    @GetMapping("/{pickingOrderId}/details")
    public ResponseEntity<List<PickingOrderDetailResponseDto>> getPickingOrderDetails(@PathVariable Integer pickingOrderId) {
        List<PickingOrderDetailResponseDto> details = pickingOrderService.findDetailsByPickingOrderId(pickingOrderId);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/search")
    public ResponseEntity<Boolean> getPickingOrdersByDispatched(@RequestParam boolean dispatched) {
        boolean result = pickingOrderService.getPickingOrdersByDispatched(dispatched);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/active")
    public ResponseEntity<List<PickingOrderMinimalDto>> getActivePickingOrders() {
        List<PickingOrderMinimalDto> activeOrders = pickingOrderService.findActivePickingOrders().stream()
                .map(order -> new PickingOrderMinimalDto(order.getPickingOrderId(), order.getDescription(), order.getCreatedDateTime()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(activeOrders);
    }
}
