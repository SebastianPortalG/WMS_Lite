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
@Table(name = "DispatchMaster")
@Getter
@Setter
@NoArgsConstructor
public class DispatchMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer dispatchMasterId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    private String remissionGuide;

    private String description;

    @OneToOne
    private PickingOrder pickingOrder;

    @OneToMany(mappedBy = "dispatchMaster", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DispatchDetail> dispatchDetails;

    private boolean processFinished;
    @CreationTimestamp
    private LocalDateTime createdDateTime;

    @UpdateTimestamp
    private LocalDateTime modifiedDateTime;

    private String createdBy;
    private String modifiedBy;
}
