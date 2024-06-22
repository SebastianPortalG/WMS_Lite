package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.InventoryComparison;
import com.sebastianportal.warehouseservice.model.InventoryMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryComparisonRepository extends JpaRepository<InventoryComparison, Integer> {
    List<InventoryComparison> findByInventory_InventoryOpId(Integer inventoryOpId);
    List<InventoryComparison> findByInventory_InventoryMaster_InventoryMasterId(Integer inventoryMasterId);
    List<InventoryComparison> findByInventory_InventoryMaster(InventoryMaster inventoryMaster);
}
