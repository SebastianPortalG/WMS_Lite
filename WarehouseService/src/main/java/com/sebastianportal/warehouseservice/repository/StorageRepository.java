package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.Storage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StorageRepository extends JpaRepository<Storage, Integer> {

    List<Storage> findByLocation_LocationId_OrderByBatch_ExpiryDate(Integer locationId);
    Optional<Storage> findByBatch_BatchIdAndLocation_LocationId(Integer batchId, Integer locationId);

    @Query("SELECT s FROM Storage s WHERE s.batch.item.productId = :productId ORDER BY s.batch.expiryDate ASC")
    List<Storage> findByProductIdOrderByExpiryDate(@Param("productId") Integer productId);
}
