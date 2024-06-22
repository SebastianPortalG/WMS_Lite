package com.sebastianportal.warehouseservice.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ubicacion")
@Getter
@Setter
@NoArgsConstructor
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer locationId;

    @Column(nullable = false, unique = false)
    private String zone;

    @Column(nullable = false)
    private String aisle;

    @Column(nullable = false)
    private String shelf;

    @Column(nullable = false)
    private Integer capacity;

    private String capacityUnit;
    @CreationTimestamp
    private LocalDateTime createdDateTime;

    @UpdateTimestamp
    private LocalDateTime modifiedDateTime;

    private String createdBy;
    private String modifiedBy;

    public String generateCode() {
        return zone + "-" + aisle + "-" + shelf;
    }

    public String generateStringName() {
        return "Zona: " + zone + ", Pasillo: " + aisle + ", Casillero: " + shelf;
    }
}