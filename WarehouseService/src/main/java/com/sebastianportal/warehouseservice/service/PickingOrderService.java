package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.dto.BasicCreationResponseDto;
import com.sebastianportal.warehouseservice.dto.PickingOrderCreationDto;
import com.sebastianportal.warehouseservice.dto.PickingOrderDetailDto;
import com.sebastianportal.warehouseservice.dto.PickingOrderDetailResponseDto;
import com.sebastianportal.warehouseservice.exception.ProductNotFoundException;
import com.sebastianportal.warehouseservice.model.PickingOrder;
import com.sebastianportal.warehouseservice.model.PickingOrderDetail;
import com.sebastianportal.warehouseservice.model.Product;
import com.sebastianportal.warehouseservice.model.User;
import com.sebastianportal.warehouseservice.repository.PickingOrderRepository;
import com.sebastianportal.warehouseservice.repository.PickingOrderDetailRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PickingOrderService {

    @Autowired
    private PickingOrderRepository pickingOrderRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private PickingOrderDetailRepository pickingOrderDetailRepository;

    public PickingOrder savePickingOrder(PickingOrder pickingOrder) {
        return pickingOrderRepository.save(pickingOrder);
    }

    public PickingOrderDetail savePickingOrderDetail(PickingOrderDetail pickingOrderDetail) {
        return pickingOrderDetailRepository.save(pickingOrderDetail);
    }

    public List<PickingOrderDetailResponseDto> findDetailsByPickingOrderId(Integer pickingOrderId) {
        List<PickingOrderDetail> details = pickingOrderDetailRepository.findByPickingOrder_PickingOrderId(pickingOrderId);
        List<PickingOrderDetailResponseDto> dtos = new ArrayList<>();
        for (PickingOrderDetail detail : details) {
            PickingOrderDetailResponseDto dto = new PickingOrderDetailResponseDto();
            dto.setProduct(detail.getProduct());
            dto.setQuantity(detail.getQuantity());
            dto.setPickedQuantity(detail.getPickedQuantity());
            dto.setRemainingQuantity(detail.getRemainingQuantity());
            dtos.add(dto);
        }
        return dtos;
    }

    public PickingOrder findById(Integer pickingOrderId) {
        return pickingOrderRepository.findById(pickingOrderId).orElse(null);
    }
    public PickingOrder createPickingOrder(User user, PickingOrderCreationDto dto)  throws ProductNotFoundException {
        PickingOrder pickingOrder = new PickingOrder();
        pickingOrder.setUser(user);
        pickingOrder.setDescription(dto.getDescription());
        pickingOrder.setCreatedBy(user.getUsername());
        List<PickingOrderDetail> details = new ArrayList<>();
        PickingOrder savedOrder = pickingOrderRepository.save(pickingOrder);
        for (PickingOrderDetailDto detailDto : dto.getDetails()) {
            Product product = productService.findProductById(detailDto.getProductId());
            PickingOrderDetail detail = new PickingOrderDetail();
            detail.setPickingOrder(savedOrder);
            detail.setProduct(product);
            detail.setQuantity(detailDto.getQuantity());
            detail.setRemainingQuantity(detailDto.getQuantity());
            detail.setPickedQuantity(0); // Initially set to 0
            detail.setCreatedBy(user.getUsername());
            details.add(detail);
        }

        savedOrder.setPickingOrderDetails(details);

        return pickingOrderRepository.save(savedOrder);
    }

    public boolean getPickingOrdersByDispatched(boolean dispatched) {
        var list = pickingOrderRepository.findByDispatched(dispatched);
        return !list.isEmpty();
    }

    public List<PickingOrder> findActivePickingOrders() {
        return pickingOrderRepository.findByDispatched(false);
    }
    @Transactional
    public void updatePickingOrderForDispatch(Integer pickingOrderId, Integer productId, Integer quantity) {
        PickingOrderDetail pickingOrderDetail = pickingOrderDetailRepository.findByPickingOrder_PickingOrderIdAndProduct_ProductId(pickingOrderId, productId)
                .orElseThrow(() -> new EntityNotFoundException("PickingOrderDetail not found with pickingOrderId: " + pickingOrderId + " and productId: " + productId));

        pickingOrderDetail.setPickedQuantity(pickingOrderDetail.getPickedQuantity() + quantity);
        pickingOrderDetail.setRemainingQuantity(pickingOrderDetail.getRemainingQuantity() - quantity);
        pickingOrderDetailRepository.save(pickingOrderDetail);
    }
}
