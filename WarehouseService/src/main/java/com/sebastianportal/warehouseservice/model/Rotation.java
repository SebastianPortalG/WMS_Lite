package com.sebastianportal.warehouseservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rotacion")
@Getter
@Setter
@NoArgsConstructor
public class Rotation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer rotationId;
    @Column(length = 2)
    private String Rotacion;
}
