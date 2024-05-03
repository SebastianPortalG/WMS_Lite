package com.sebastianportal.warehouseservice.controller;

import com.sebastianportal.warehouseservice.dto.SimpleBatchResponseDto;
import com.sebastianportal.warehouseservice.service.BatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BatchController {

    @Autowired
    private BatchService batchService;

    @GetMapping("/reception/{receptionMasterId}/available")
    public ResponseEntity<List<SimpleBatchResponseDto>> getAvailableBatches(@PathVariable Integer receptionMasterId) {
        List<SimpleBatchResponseDto> batches = batchService.findAvailableBatchesByReceptionMaster(receptionMasterId);
        return ResponseEntity.ok(batches);
    }
}