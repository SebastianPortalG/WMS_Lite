package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class BatchDto {
    private String code;
    private LocalDateTime expiryDate;
}