package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.InventoryMaster;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryMasterRepository extends JpaRepository<InventoryMaster, Integer> {
}
