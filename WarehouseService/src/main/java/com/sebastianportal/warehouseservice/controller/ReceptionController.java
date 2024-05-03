package com.sebastianportal.warehouseservice.controller;

import com.sebastianportal.warehouseservice.config.JwtTokenProvider;
import com.sebastianportal.warehouseservice.dto.BasicCreationResponseDto;
import com.sebastianportal.warehouseservice.dto.BatchCreationDto;
import com.sebastianportal.warehouseservice.dto.ReceptionMinimalDto;
import com.sebastianportal.warehouseservice.dto.ReceptionRequest;
import com.sebastianportal.warehouseservice.exception.ProductNotFoundException;
import com.sebastianportal.warehouseservice.model.*;
import com.sebastianportal.warehouseservice.service.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/reception")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ReceptionController {

    @Autowired
    private ReceptionMasterService receptionMasterService;

    @Autowired
    private BatchService batchService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/start-with-batches")
    public ResponseEntity<?> startReceptionWithBatches(HttpServletRequest request,
                                                       @RequestBody ReceptionRequest requestBody) throws ProductNotFoundException {
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
            ReceptionMaster receptionMaster = receptionMasterService.startReceptionWithBatches(user, requestBody.getBatchCreationDtos(), requestBody.getReceptionDate());
            BasicCreationResponseDto responseDto = new BasicCreationResponseDto(receptionMaster.getReceptionMasterId(), "Reception created successfully");
            return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
        } catch (ProductNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new BasicCreationResponseDto(null, "Error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{receptionMasterId}/store")
    public ResponseEntity<?> storeBatch(@PathVariable Integer receptionMasterId,
                                              @RequestParam Integer batchId,
                                              @RequestParam Integer locationId,
                                              @RequestParam Integer quantity,
                                              HttpServletRequest request) {
        try{
            String authToken = request.getHeader("Authorization");
            if (authToken == null || !authToken.startsWith("Bearer ")) {
                return new ResponseEntity<>("Authorization token is missing or invalid.", HttpStatus.FORBIDDEN);
            }
            String username = tokenProvider.getUserIdFromJWT(authToken.substring(7));
            User user = userService.findByUsername(username);
            if (user == null) {
                return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
            }
            Storage storedBatch = storageService.storeBatchInLocationReception(batchId, locationId, quantity, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(storedBatch);
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
        return new ResponseEntity<>(new BasicCreationResponseDto(null, "Error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search")
    public boolean getReceptionsByProcessFinished(@RequestParam boolean processFinished) {
        return receptionMasterService.getReceptionMastersByProcessFinished(processFinished);
    }
    @GetMapping("/active")
    public List<ReceptionMinimalDto> getActiveReceptions() {
        return receptionMasterService.findActiveReceptions().stream()
                .map(reception -> new ReceptionMinimalDto(reception.getReceptionMasterId(), reception.getReceptionDate()))
                .collect(Collectors.toList());
    }
}