package com.sebastianportal.warehouseservice.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "productolote")
@Getter
@Setter
@NoArgsConstructor
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer batchId;

    @ManyToOne
    @JoinColumn(name = "itemId", nullable = false)
    private Product item;

    @Column(nullable = false)
    private Integer quantity;

    private String code;

    @Column(nullable = false)
    private Integer availableQuantity;

    @Column(nullable = false)
    private Integer storedQuantity;
    private Integer dispatchedQuantity;
    @Column()
    private LocalDateTime expiryDate;

    @ManyToOne
    @JoinColumn(name = "receptionMasterId", nullable = false)
    private ReceptionMaster receptionMaster;

    @CreationTimestamp
    private LocalDateTime createdDateTime;

    @UpdateTimestamp
    private LocalDateTime modifiedDateTime;

    private String createdBy;
    private String modifiedBy;

    public Batch(Product item, ReceptionMaster receptionMaster, User createdBy, Integer quantity) {
        this.item = item;
        this.receptionMaster = receptionMaster;
        this.createdBy = createdBy.getUsername();
        this.createdDateTime = LocalDateTime.now();
        this.quantity = quantity;
        this.availableQuantity = quantity;
        this.storedQuantity = 0;
        this.dispatchedQuantity = 0;
    }
    public void generateBatchCode() {
        String categoryPart = this.item.getCategory().getName();
        String namePart = this.item.getName().substring(0, Math.min(this.item.getName().length(), 3)).toUpperCase();
        String expiryPart = this.expiryDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String receptionPart = this.receptionMaster.getReceptionDate().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        this.code = categoryPart + "-" + namePart + "-" + expiryPart + "-" + receptionPart;
    }
}