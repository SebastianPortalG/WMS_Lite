package com.sebastianportal.warehouseservice.controller;

import com.sebastianportal.warehouseservice.model.ProductCategory;
import com.sebastianportal.warehouseservice.model.Role;
import com.sebastianportal.warehouseservice.model.Rotation;
import com.sebastianportal.warehouseservice.service.ProductCategoryService;
import com.sebastianportal.warehouseservice.service.RoleService;
import com.sebastianportal.warehouseservice.service.RotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/metadata")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MetadataController {

    @Autowired
    private ProductCategoryService productCategoryService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private RotationService rotationService;

    @GetMapping("/product-categories")
    public ResponseEntity<List<ProductCategory>> getProductCategories() {
        List<ProductCategory> categories = productCategoryService.getAllProductCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getRoles() {
        List<Role> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/rotations")
    public ResponseEntity<List<Rotation>> getRotations() {
        List<Rotation> rotations = rotationService.getAllRotations();
        return ResponseEntity.ok(rotations);
    }
}