package com.sebastianportal.warehouseservice.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "producto")
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoryId", nullable = false)
    private ProductCategory category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rotationId", nullable = false)
    private Rotation rotation;

    private boolean consumable;
    private boolean expires;
    private boolean active;
    private boolean deleted = false;
    @CreationTimestamp
    private LocalDateTime createdDateTime;

    @UpdateTimestamp
    private LocalDateTime modifiedDateTime;

    private String createdBy;
    private String modifiedBy;

    public String generateCode() {
        return category.getName().substring(0, 3).toUpperCase() + "-" + name.replaceAll(" ", "-").toUpperCase();
    }


    public String generateStringName() {
        return "Product: " + name + ", Category: " + category.getName();
    }
}