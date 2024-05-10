package com.sebastianportal.warehouseservice.controller;

import com.sebastianportal.warehouseservice.config.JwtTokenProvider;
import com.sebastianportal.warehouseservice.dto.BasicCreationResponseDto;
import com.sebastianportal.warehouseservice.dto.SimpleBatchResponseDto;
import com.sebastianportal.warehouseservice.model.Storage;
import com.sebastianportal.warehouseservice.model.User;
import com.sebastianportal.warehouseservice.service.BatchService;
import com.sebastianportal.warehouseservice.service.StorageService;
import com.sebastianportal.warehouseservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BatchController {

    @Autowired
    private BatchService batchService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @GetMapping("/reception/{receptionMasterId}/available")
    public ResponseEntity<List<SimpleBatchResponseDto>> getAvailableBatches(@PathVariable Integer receptionMasterId) {
        List<SimpleBatchResponseDto> batches = batchService.findAvailableBatchesByReceptionMaster(receptionMasterId);
        return ResponseEntity.ok(batches);
    }

    @PostMapping("/move")
    public ResponseEntity<?> moveBatch(
            @RequestParam Integer batchId,
            @RequestParam Integer sourceLocationId,
            @RequestParam Integer targetLocationId,
            @RequestParam Integer quantity,
            HttpServletRequest request) {

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

            Storage storage = storageService.moveBatch(batchId, sourceLocationId, targetLocationId, quantity, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(storage);
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new BasicCreationResponseDto(null, "Error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/location/{locationId}/batches")
    public ResponseEntity<List<SimpleBatchResponseDto>> getBatchesByLocation(@PathVariable Integer locationId) {
        List<SimpleBatchResponseDto> batches = storageService.getBatchesByLocation(locationId);
        if (batches.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(batches);
    }
}