package com.sebastianportal.warehouseservice.controller;

import com.sebastianportal.warehouseservice.config.JwtTokenProvider;
import com.sebastianportal.warehouseservice.dto.BasicCreationResponseDto;
import com.sebastianportal.warehouseservice.dto.DispatchEndDto;
import com.sebastianportal.warehouseservice.dto.StorageDto;
import com.sebastianportal.warehouseservice.model.DispatchMaster;
import com.sebastianportal.warehouseservice.model.User;
import com.sebastianportal.warehouseservice.service.DispatchService;
import com.sebastianportal.warehouseservice.service.PickingOrderService;
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
@RequestMapping("/api/dispatches")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DispatchController {

    @Autowired
    private DispatchService dispatchService;
    @Autowired
    private PickingOrderService pickingOrderService;
    @Autowired
    private StorageService storageService;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtTokenProvider tokenProvider;

    @GetMapping("/dispatch/{productId}")
    public ResponseEntity<List<StorageDto>> getStoragesForDispatch(@PathVariable Integer productId) {
        List<StorageDto> storages = storageService.findStoragesByProductId(productId);
        return ResponseEntity.ok(storages);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createDispatchMaster(HttpServletRequest request, @RequestParam Integer pickingOrderId) {
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

            DispatchMaster dispatchMaster = dispatchService.createDispatchMaster(user, pickingOrderId);
            BasicCreationResponseDto responseDto = new BasicCreationResponseDto(dispatchMaster.getDispatchMasterId(), "DispatchMaster created successfully");
            return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new BasicCreationResponseDto(null, "Error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/pickup")
    public ResponseEntity<?> dispatchPickingOrder(HttpServletRequest request,
                                                  @RequestParam Integer pickingOrderId,
                                                  @RequestParam Integer batchId,
                                                  @RequestParam Integer locationId,
                                                  @RequestParam Integer quantity) {
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

            dispatchService.dispatchPickingOrder(pickingOrderId, batchId, locationId, quantity, user);
            return new ResponseEntity<>("Dispatch processed successfully", HttpStatus.CREATED);
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/update/{dispatchMasterId}")
    public ResponseEntity<?> updateDispatchMaster(HttpServletRequest request, @PathVariable Integer dispatchMasterId, @RequestBody DispatchEndDto updateRequest) {
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

            DispatchMaster updatedDispatchMaster = dispatchService.endDispatch(dispatchMasterId, updateRequest);
            return new ResponseEntity<>(updatedDispatchMaster, HttpStatus.OK);
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
