package com.sebastianportal.warehouseservice.controller;

import com.sebastianportal.warehouseservice.dto.KardexDto;
import com.sebastianportal.warehouseservice.dto.StorageListDto;
import com.sebastianportal.warehouseservice.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storage")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class StorageController {
    @Autowired
    private StorageService storageService;

    @GetMapping
    public ResponseEntity<List<StorageListDto>> searchStorages(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String product,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String classification,
            @RequestParam(required = false) String groupBy,
            @RequestParam(required = false) boolean orderByExpiryDate) {
        List<StorageListDto> storages = storageService.searchStorages(code, product, status, classification, groupBy, orderByExpiryDate);
        return ResponseEntity.ok(storages);
    }
    @GetMapping("/kardex/{productId}")
    public ResponseEntity<List<KardexDto>> getKardexByProductId(@PathVariable int productId) {
        List<KardexDto> kardex = storageService.getKardexByProductId(productId);
        return ResponseEntity.ok(kardex);
    }
    @GetMapping("/kardex")
    public ResponseEntity<List<KardexDto>> getKardexForWarehouse() {
        List<KardexDto> kardex = storageService.getKardexForWarehouse();
        return ResponseEntity.ok(kardex);
    }
}
