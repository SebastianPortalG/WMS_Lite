package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.DispatchDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DispatchDetailRepository extends JpaRepository<DispatchDetail, Integer> {
    List<DispatchDetail> findByBatch_BatchIdIn(List<Integer> batchIds);
}
