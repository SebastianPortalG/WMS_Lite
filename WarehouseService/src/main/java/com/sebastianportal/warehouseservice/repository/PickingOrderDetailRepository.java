package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.PickingOrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickingOrderDetailRepository extends JpaRepository<PickingOrderDetail, Integer> {
    List<PickingOrderDetail> findByPickingOrder_PickingOrderId(Integer pickingOrderId);
    Optional<PickingOrderDetail> findByPickingOrder_PickingOrderIdAndProduct_ProductId(Integer pickingOrderId, Integer productId);
}
