package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.Storage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StorageRepository extends JpaRepository<Storage, Integer> {
    List<Storage> findByLocation_LocationId(Integer locationId);
    Optional<Storage> findByBatch_BatchIdAndLocation_LocationId(Integer batchId, Integer locationId);
}
