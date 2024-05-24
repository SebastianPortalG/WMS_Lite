package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.InventoryMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryMasterRepository extends JpaRepository<InventoryMaster, Integer> {
    List<InventoryMaster> findByInventoryFinished(boolean inventoryFinished);
}
