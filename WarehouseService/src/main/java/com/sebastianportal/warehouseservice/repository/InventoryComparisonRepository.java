package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.InventoryComparison;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryComparisonRepository extends JpaRepository<InventoryComparison, Integer> {
}
