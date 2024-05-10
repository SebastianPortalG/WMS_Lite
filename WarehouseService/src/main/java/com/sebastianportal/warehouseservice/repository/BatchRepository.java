package com.sebastianportal.warehouseservice.repository;


import com.sebastianportal.warehouseservice.model.Batch;
import com.sebastianportal.warehouseservice.model.Product;
import com.sebastianportal.warehouseservice.model.ReceptionMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Integer> {
    List<Batch> findByReceptionMaster(ReceptionMaster receptionMaster);
    Optional<Batch> findTopByItemAndItemExpiresIsFalse(Product product);
    List<Batch> findByReceptionMaster_ReceptionMasterIdAndAvailableQuantityGreaterThan(Integer receptionMasterId, int quantity);

}
