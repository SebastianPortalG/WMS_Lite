package com.sebastianportal.warehouseservice.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "DispatchDetail")
@Getter
@Setter
@NoArgsConstructor
public class DispatchDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer dispatchDetailId;

    @ManyToOne
    @JoinColumn(name = "dispatchMasterId", nullable = false)
    private DispatchMaster dispatchMaster;

    @ManyToOne
    @JoinColumn(name = "batchId", nullable = false)
    private Batch batch;

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
