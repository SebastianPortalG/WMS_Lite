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
@Table(name = "InventarioMaestra")
@Getter
@Setter
@NoArgsConstructor
public class InventoryMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer inventoryMasterId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    private String description;

    private LocalDateTime inventoryDate;
    private boolean inventoryFinished;

    @CreationTimestamp
    private LocalDateTime createdDateTime;

    @UpdateTimestamp
    private LocalDateTime modifiedDateTime;

    private String createdBy;
    private String modifiedBy;

    @OneToMany(mappedBy = "inventoryMaster", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Inventory> inventories;
}
