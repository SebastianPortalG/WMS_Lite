package com.sebastianportal.warehouseservice.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Inventario")
@Getter
@Setter
@NoArgsConstructor
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer inventoryOpId;

    @ManyToOne
    @JoinColumn(name = "inventoryMasterId", nullable = false)
    private InventoryMaster inventoryMaster;

    @ManyToOne
    @JoinColumn(name = "itemId", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "locationId", nullable = false)
    private Location location;

    private Integer quantity;

    @CreationTimestamp
    private LocalDateTime createdDateTime;

    @UpdateTimestamp
    private LocalDateTime modifiedDateTime;

    private String createdBy;
    private String modifiedBy;
}
