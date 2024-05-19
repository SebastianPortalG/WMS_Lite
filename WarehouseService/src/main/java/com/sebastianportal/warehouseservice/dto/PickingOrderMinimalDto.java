package com.sebastianportal.warehouseservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class PickingOrderMinimalDto {
    private Integer pickingOrderId;
    private String description;
    private LocalDateTime createdDateTime;
}
