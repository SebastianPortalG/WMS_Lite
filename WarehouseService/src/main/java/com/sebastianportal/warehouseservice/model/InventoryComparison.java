package com.sebastianportal.warehouseservice.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ComparacionInventario")
@Getter
@Setter
@NoArgsConstructor
public class InventoryComparison {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer comparisonOpId;

    @ManyToOne
    @JoinColumn(name = "inventoryOpId", nullable = true)
    private Inventory inventory;

    @ManyToOne
    @JoinColumn(name = "locationId", nullable = false)
    private Location location;

    @OneToMany
    @JoinColumn(name = "comparisonOpId")
    private List<Storage> storages;

    private Integer comparedQuantity;
    private boolean isOptional;

    @CreationTimestamp
    private LocalDateTime createdDateTime;

    @UpdateTimestamp
    private LocalDateTime modifiedDateTime;

    private String createdBy;
    private String modifiedBy;
    public Product getProduct() {
        return inventory != null ? inventory.getProduct() : null;
    }
}
