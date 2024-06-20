package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.dto.BasicCreationResponseDto;
import com.sebastianportal.warehouseservice.dto.InventoryMasterRequest;
import com.sebastianportal.warehouseservice.dto.InventoryMasterRequestEnd;
import com.sebastianportal.warehouseservice.dto.InventoryRequest;
import com.sebastianportal.warehouseservice.model.*;
import com.sebastianportal.warehouseservice.repository.InventoryMasterRepository;
import com.sebastianportal.warehouseservice.repository.InventoryRepository;
import com.sebastianportal.warehouseservice.repository.LocationRepository;
import com.sebastianportal.warehouseservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
import com.sebastianportal.warehouseservice.dto.BasicCreationResponseDto;
import com.sebastianportal.warehouseservice.dto.InventoryMasterRequest;
import com.sebastianportal.warehouseservice.dto.InventoryMasterRequestEnd;
import com.sebastianportal.warehouseservice.dto.InventoryRequest;
import com.sebastianportal.warehouseservice.model.*;
import com.sebastianportal.warehouseservice.repository.InventoryMasterRepository;
import com.sebastianportal.warehouseservice.repository.InventoryRepository;
import com.sebastianportal.warehouseservice.repository.LocationRepository;
import com.sebastianportal.warehouseservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InventoryService {
    @Autowired
    private InventoryMasterRepository inventoryMasterRepository;

    @Autowired
    private InventoryRepository inventoryRepository;
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private NotificationService notificationService;

    public BasicCreationResponseDto createInventoryMaster(User user, InventoryMasterRequest inventoryMasterRequest) {
        InventoryMaster inventoryMaster = new InventoryMaster();
        inventoryMaster.setUser(user);
        inventoryMaster.setDescription(inventoryMasterRequest.getDescription());
        inventoryMaster.setInventoryDate(inventoryMasterRequest.getInventoryDate().atStartOfDay());
        inventoryMaster.setCreatedDateTime(LocalDateTime.now());
        inventoryMaster.setModifiedDateTime(LocalDateTime.now());

        InventoryMaster savedInventoryMaster = inventoryMasterRepository.save(inventoryMaster);

        BasicCreationResponseDto response = new BasicCreationResponseDto();
        response.setCreatedId(savedInventoryMaster.getInventoryMasterId());

        return response;
    }

    public BasicCreationResponseDto createInventory(InventoryRequest inventoryRequest) {
        InventoryMaster inventoryMaster = inventoryMasterRepository.findById(inventoryRequest.getInventoryMasterId())
                .orElseThrow(() -> new RuntimeException("InventoryMaster not found"));
        if(inventoryMaster.isInventoryFinished()) throw new RuntimeException("InventoryMaster already finished");
        Location location = locationRepository.findById(inventoryRequest.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        List<Integer> productIds = inventoryRequest.getProducts().stream()
                .map(InventoryRequest.ProductQuantity::getProductId)
                .toList();

        List<Product> products = productRepository.findAllById(productIds);

        if (products.size() != productIds.size()) {
            throw new RuntimeException("One or more products not found");
        }

        Map<Integer, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getProductId, product -> product));
        List<Inventory> inventoriesToSave = inventoryRequest.getProducts().stream()
                .map(pq -> {
                    Inventory inventory = new Inventory();
                    inventory.setInventoryMaster(inventoryMaster);
                    inventory.setLocation(location);
                    inventory.setProduct(productMap.get(pq.getProductId()));
                    inventory.setQuantity(pq.getQuantity());
                    return inventory;
                })
                .toList();
        inventoryRepository.saveAll(inventoriesToSave);
        return new BasicCreationResponseDto(inventoryRequest.getInventoryMasterId(), "Inventory saved successfully");
    }
    public List<InventoryMaster> getActiveInventoryMasters() {
        return inventoryMasterRepository.findByInventoryFinished(false);
    }
    public InventoryMaster updateInventoryMaster(int inventoryMasterId, InventoryMasterRequestEnd updateRequest) {
        StringBuilder sb = new StringBuilder();
        InventoryMaster inventoryMaster = inventoryMasterRepository.findById(inventoryMasterId)
                .orElseThrow(() -> new RuntimeException("InventoryMaster not found"));
        if(inventoryMaster.isInventoryFinished()) throw new RuntimeException("InventoryMaster already finished");
        sb.append(inventoryMaster.getDescription()).append(System.getProperty("line.separator")).append(updateRequest.getDescription());
        inventoryMaster.setDescription(sb.toString());
        inventoryMaster.setInventoryFinished(updateRequest.isInventoryFinished());
        InventoryMaster updatedInventoryMaster = inventoryMasterRepository.save(inventoryMaster);
        if(updatedInventoryMaster.isInventoryFinished()){
            StringBuilder sb2 = new StringBuilder();
            sb2.append("Se registro el inventario ").append(updatedInventoryMaster.getInventoryMasterId());
            notificationService.createNotificationForRole("SUPERVISOR", sb2.toString());
            notificationService.createNotificationForRole("ADMIN", sb2.toString());
        }
        return inventoryMasterRepository.save(inventoryMaster);
    }
}
