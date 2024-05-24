// InventoryController.java
package com.sebastianportal.warehouseservice.controller;

import com.sebastianportal.warehouseservice.config.JwtTokenProvider;
import com.sebastianportal.warehouseservice.dto.*;
import com.sebastianportal.warehouseservice.model.Inventory;
import com.sebastianportal.warehouseservice.model.InventoryMaster;
import com.sebastianportal.warehouseservice.model.User;
import com.sebastianportal.warehouseservice.service.InventoryService;
import com.sebastianportal.warehouseservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class InventoryController {


    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/inventoryMaster")
    public ResponseEntity<?> createInventoryMaster(HttpServletRequest request, @RequestBody InventoryMasterRequest inventoryMasterRequest) {
        try {
            String authToken = request.getHeader("Authorization");
            if (authToken == null || !authToken.startsWith("Bearer ")) {
                return new ResponseEntity<>("Authorization token is missing or invalid.", HttpStatus.FORBIDDEN);
            }
            String username = tokenProvider.getUserIdFromJWT(authToken.substring(7));
            User user = userService.findByUsername(username);
            if (user == null) {
                return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
            }

            BasicCreationResponseDto response = inventoryService.createInventoryMaster(user, inventoryMasterRequest);

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new BasicCreationResponseDto(null, "Error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/createInventory")
    public ResponseEntity<?> createInventory(@RequestBody InventoryRequest inventoryRequest) {
        try {
            BasicCreationResponseDto response = inventoryService.createInventory(inventoryRequest);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new BasicCreationResponseDto(null, "Error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/inventoryMasters/active")
    public ResponseEntity<?> fetchActiveInventoryMasters() {
        try {
            List<InventoryMaster> activeInventoryMasters = inventoryService.getActiveInventoryMasters();
            List<ActiveInventoryMasterDto> activeInventoryMasterDtos = activeInventoryMasters.stream()
                    .map(im -> new ActiveInventoryMasterDto(im.getInventoryMasterId(), im.getDescription(), im.getInventoryDate()))
                    .toList();
            return new ResponseEntity<>(activeInventoryMasterDtos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new BasicCreationResponseDto(null, "Error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/inventoryMasters/{inventoryMasterId}")
    public ResponseEntity<?> updateInventoryMaster(@PathVariable int inventoryMasterId, @RequestBody InventoryMasterRequestEnd updateRequest) {
        try {
            InventoryMaster inventoryMaster = inventoryService.updateInventoryMaster(inventoryMasterId, updateRequest);
            return new ResponseEntity<>(inventoryMaster, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new BasicCreationResponseDto(null, "Error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
