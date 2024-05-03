package com.sebastianportal.warehouseservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class SimpleBatchResponseDto {
    private Integer batchId;
    private String productName;
    private Integer availableQuantity;
    private LocalDateTime expiryDate;
}
