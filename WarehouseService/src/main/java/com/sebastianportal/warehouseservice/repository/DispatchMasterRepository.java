package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.DispatchMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DispatchMasterRepository extends JpaRepository<DispatchMaster, Integer> {
    Optional<DispatchMaster> findByPickingOrder_PickingOrderId(Integer pickingOrderId);
    List<DispatchMaster> findByDispatchDetails_Batch_BatchIdIn(List<Integer> batchIds);
}
