package com.sebastianportal.warehouseservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "reception_master")
@Getter
@Setter
@NoArgsConstructor
public class ReceptionMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer receptionMasterId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    private LocalDateTime receptionDate;

    private String remissionGuide;

    private String description;

    private boolean processFinished;

    @OneToMany(mappedBy = "receptionMaster")
    private Set<Batch> batches;

    @CreationTimestamp
    private LocalDateTime createdDateTime;

    @UpdateTimestamp
    private LocalDateTime modifiedDateTime;

    private String createdBy;

    private String modifiedBy;
}