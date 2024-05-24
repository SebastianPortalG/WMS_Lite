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
    @Query("SELECT s FROM Storage s WHERE " +
            "(LOWER(TRIM(s.batch.code)) LIKE LOWER(CONCAT('%', :code, '%')) OR :code IS NULL) OR " +
            "(LOWER(TRIM(s.batch.item.name)) LIKE LOWER(CONCAT('%', :product, '%')) OR :product IS NULL) OR " +
            "(LOWER(TRIM(s.batch.item.rotation.Rotacion)) LIKE LOWER(CONCAT('%', :status, '%')) OR :status IS NULL) OR " +
            "(LOWER(TRIM(s.batch.item.category.name)) LIKE LOWER(CONCAT('%', :classification, '%')) OR :classification IS NULL) " +
            "ORDER BY CASE WHEN :orderByExpiryDate = true THEN s.batch.expiryDate END ASC, " +
            "CASE WHEN :orderByExpiryDate = false THEN s.batch.item.name END")
    List<Storage> searchStorages(@Param("code") String code,
                                 @Param("product") String product,
                                 @Param("status") String status,
                                 @Param("classification") String classification,
                                 @Param("orderByExpiryDate") boolean orderByExpiryDate);



}
