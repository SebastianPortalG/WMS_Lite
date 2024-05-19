package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.PickingOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PickingOrderRepository extends JpaRepository<PickingOrder, Integer> {
    List<PickingOrder> findByDispatched(boolean dispatched);
}
