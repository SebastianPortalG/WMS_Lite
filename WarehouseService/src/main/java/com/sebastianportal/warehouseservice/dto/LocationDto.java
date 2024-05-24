package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocationDto {
    private Integer locationId;
    private String zone;
    private String aisle;
    private String shelf;
}
