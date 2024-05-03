package com.sebastianportal.warehouseservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BasicCreationResponseDto {
    private Integer createdId;
    private String statusMessage;
}
