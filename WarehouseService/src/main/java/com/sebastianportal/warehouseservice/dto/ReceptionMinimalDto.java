package com.sebastianportal.warehouseservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ReceptionMinimalDto {
    private Integer id;
    private LocalDateTime receptionDate;
}
