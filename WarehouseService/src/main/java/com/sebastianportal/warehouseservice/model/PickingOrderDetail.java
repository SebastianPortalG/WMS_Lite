package com.sebastianportal.warehouseservice.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "PickingOrderDetail")
@Getter
@Setter
@NoArgsConstructor
public class PickingOrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pickingOrderDetailId;

    @ManyToOne
    @JoinColumn(name = "pickingOrderId", nullable = false)
    private PickingOrder pickingOrder;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "itemId", nullable = false)
    private Product product;

    private Integer quantity;
    private Integer pickedQuantity;
    private Integer remainingQuantity;
    private Integer returnedQuantity;
    @CreationTimestamp
    private LocalDateTime createdDateTime;

    @UpdateTimestamp
    private LocalDateTime modifiedDateTime;

    private String createdBy;
    private String modifiedBy;
}
