package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDto {
    private Integer productId;
    private String name;
    private String description;
    private boolean active;
    private String category;
    private boolean expires;
    private boolean consumable;
    private String rotation;
}
