package com.sebastianportal.warehouseservice.service;


import com.sebastianportal.warehouseservice.dto.InventoryComparisonDto;
import com.sebastianportal.warehouseservice.dto.StorageDto;
import com.sebastianportal.warehouseservice.model.*;
import com.sebastianportal.warehouseservice.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class InventoryComparisonService {
    @Autowired
    private InventoryMasterRepository inventoryMasterRepository;

    @Autowired
    private StorageRepository storageRepository;

    @Autowired
    private InventoryComparisonRepository inventoryComparisonRepository;
    @Autowired
    private InventoryRepository inventoryRepository;
    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<InventoryComparisonDto> compareInventory(Integer inventoryMasterId, String username) {
        InventoryMaster inventoryMaster = inventoryMasterRepository.findById(inventoryMasterId)
                .orElseThrow(() -> new EntityNotFoundException("Inventory not found"));
        List<InventoryComparisonDto> comparisonList = new ArrayList<>();

        // Get all products and locations from the inventory
        List<Inventory> inventories = inventoryRepository.findByInventoryMaster_InventoryMasterId(inventoryMaster.getInventoryMasterId());

        Set<Product> productsInInventory = inventories.stream().map(Inventory::getProduct).collect(Collectors.toSet());
        Set<Location> locationsInInventory = inventories.stream().map(Inventory::getLocation).collect(Collectors.toSet());
        Set<String> existingComparisons = new HashSet<>();
        // Compare for each inventory line
        for (Inventory inventory : inventories) {
            Product product = inventory.getProduct();
            Location location = inventory.getLocation();

            List<Storage> storages = storageRepository.findByProductIdOrderByExpiryDate(product.getProductId());
            Map<Location, Integer> storageMap = storages.stream().collect(Collectors.toMap(Storage::getLocation, Storage::getStoredQuantity));

            InventoryComparisonDto comparisonDto = new InventoryComparisonDto();
            comparisonDto.setProductCode(product.generateCode());
            comparisonDto.setLocation(location.generateStringName());
            comparisonDto.setInventoryQuantity(inventory.getQuantity());
            comparisonDto.setStorageQuantity(storageMap.getOrDefault(location, 0));
            comparisonDto.setDifference(comparisonDto.getInventoryQuantity() - comparisonDto.getStorageQuantity());
            comparisonDto.setInventoryOpId(inventory.getInventoryOpId());
            String key = comparisonDto.getProductCode() + comparisonDto.getLocation();
            if (!existingComparisons.contains(key)) {
                comparisonList.add(comparisonDto);
                existingComparisons.add(key);
                storageMap.remove(location);
                InventoryComparison comparison = new InventoryComparison();
                comparison.setInventory(inventory);
                comparison.setLocation(location);
                comparison.setComparedQuantity(comparisonDto.getStorageQuantity());
                comparison.setOptional(false);
                comparison.setCreatedBy(username);
                comparison.setModifiedBy(username);
                inventoryComparisonRepository.save(comparison);
            }

        }

        // Compare for each product in inventory across all locations
        for (Product product : productsInInventory) {
            List<Storage> storages = storageRepository.findByProductIdOrderByExpiryDate(product.getProductId());

            for (Storage storage : storages) {
                Location location = storage.getLocation();
                String key = product.generateCode() + location.generateStringName();
                if (!existingComparisons.contains(key)) {
                    InventoryComparisonDto comparisonDto = new InventoryComparisonDto();
                    comparisonDto.setProductCode(product.generateCode());
                    comparisonDto.setLocation(storage.getLocation().generateStringName());
                    comparisonDto.setInventoryQuantity(0);
                    comparisonDto.setStorageQuantity(storage.getStoredQuantity());
                    comparisonDto.setDifference(comparisonDto.getInventoryQuantity() - comparisonDto.getStorageQuantity());
                    comparisonList.add(comparisonDto);
                    existingComparisons.add(key);
                    InventoryComparison comparison = new InventoryComparison();
                    comparison.setInventory(null); // No corresponding inventory line
                    comparison.setLocation(location);
                    comparison.setComparedQuantity(comparisonDto.getStorageQuantity());
                    comparison.setOptional(true);
                    comparison.setCreatedBy(username);
                    comparison.setModifiedBy(username);
                    inventoryComparisonRepository.save(comparison);
                }
            }
        }

        // Compare for each location in inventory across all products
        for (Location location : locationsInInventory) {
            List<Storage> storages = storageRepository.findByLocation_LocationId_OrderByBatch_ExpiryDate(location.getLocationId());

            for (Storage storage : storages) {
                Product product = storage.getBatch().getItem();

                // If this product-location pair was not in the inventory, create a comparison entry
                String key = product.generateCode() + location.generateStringName();
                if (!existingComparisons.contains(key)) {
                    InventoryComparisonDto comparisonDto = new InventoryComparisonDto();
                    comparisonDto.setProductCode(storage.getBatch().getItem().generateCode());
                    comparisonDto.setLocation(location.generateStringName());
                    comparisonDto.setInventoryQuantity(0);
                    comparisonDto.setStorageQuantity(storage.getStoredQuantity());
                    comparisonDto.setDifference(comparisonDto.getInventoryQuantity() - comparisonDto.getStorageQuantity());
                    comparisonList.add(comparisonDto);
                    existingComparisons.add(key);
                    InventoryComparison comparison = new InventoryComparison();
                    comparison.setInventory(null); // No corresponding inventory line
                    comparison.setLocation(location);
                    comparison.setComparedQuantity(comparisonDto.getStorageQuantity());
                    comparison.setOptional(true);
                    comparison.setCreatedBy(username);
                    comparison.setModifiedBy(username);
                    inventoryComparisonRepository.save(comparison);
                }
            }
        }

        return comparisonList;
    }
}
