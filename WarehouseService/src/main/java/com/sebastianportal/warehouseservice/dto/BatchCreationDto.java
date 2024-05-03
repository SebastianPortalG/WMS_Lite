package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BatchCreationDto {
    private Integer productId;
    private Integer quantity;
    private LocalDateTime expiryDate;
}
