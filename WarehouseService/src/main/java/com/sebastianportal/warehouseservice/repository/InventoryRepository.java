package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
}
