package com.sebastianportal.warehouseservice.repository;


import com.sebastianportal.warehouseservice.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    @Query("SELECT COUNT(p) FROM Product p WHERE p.active = true")
    int countActiveProducts();

    //TODO: buscar por nombre de categoria o codigo de categoria
    @Query("SELECT p FROM Product p WHERE " +
            "(LOWER(TRIM(p.name)) LIKE LOWER(CONCAT('%', TRIM(:search), '%')) OR " +
            "LOWER(TRIM(p.description)) LIKE LOWER(CONCAT('%', TRIM(:search), '%'))) " +
            "AND p.deleted = FALSE")
    Page<Product> findAllBySearch(@Param("search") String search, Pageable pageable);

    Page<Product> findByDeletedFalse(Pageable pageable);
}