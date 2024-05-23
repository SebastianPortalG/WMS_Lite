package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.Adjustment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdjustmentRepository extends JpaRepository<Adjustment, Integer> {
}
