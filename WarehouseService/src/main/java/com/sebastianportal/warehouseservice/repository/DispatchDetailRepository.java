package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.DispatchDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DispatchDetailRepository extends JpaRepository<DispatchDetail, Integer> {
}
