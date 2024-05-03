package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ReceptionRequest {
    private List<BatchCreationDto> batchCreationDtos;
    private LocalDateTime receptionDate;
}
