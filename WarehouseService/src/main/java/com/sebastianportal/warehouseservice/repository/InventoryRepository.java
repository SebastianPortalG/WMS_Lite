package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    List<Inventory> findByInventoryMaster_InventoryMasterId(Integer inventoryMasterId);
}
