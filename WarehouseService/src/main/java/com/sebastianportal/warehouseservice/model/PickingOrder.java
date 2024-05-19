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
@Table(name = "PickingOrder")
@Getter
@Setter
@NoArgsConstructor
public class PickingOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pickingOrderId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    private String description;

    @OneToMany(mappedBy = "pickingOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PickingOrderDetail> pickingOrderDetails;

    @CreationTimestamp
    private LocalDateTime createdDateTime;

    @UpdateTimestamp
    private LocalDateTime modifiedDateTime;
    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean dispatched;
    private String createdBy;
    private String modifiedBy;
}
