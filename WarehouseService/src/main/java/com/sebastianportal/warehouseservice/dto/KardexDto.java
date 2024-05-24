package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KardexDto {
    private String type; // "Reception", "Dispatch", "Total"
    private String code;
    private String date;
    private int quantity;
    private String expiryDate;
    private String location;
}
