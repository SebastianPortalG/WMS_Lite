package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.model.ProductCategory;
import com.sebastianportal.warehouseservice.repository.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductCategoryService {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    public List<ProductCategory> getAllProductCategories() {
        return productCategoryRepository.findAll();
    }

    public ProductCategory findOrCreateCategory(ProductCategory category) {
        return productCategoryRepository.findByName(category.getName())
                .orElseGet(() -> {
                    category.setCode(category.getName().substring(0,4).toUpperCase());
                    category.setDescription(category.getName());
                    return productCategoryRepository.save(category);});
    }
}