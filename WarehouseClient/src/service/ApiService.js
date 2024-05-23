import axios from 'axios';
import {
  toast
} from 'react-toastify';

const BASE_URL =
  import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  toast.error(error.response?.data?.message || "An unexpected error occurred")
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => response,
  error => {
    toast.error(error.response?.data?.message || "An unexpected error occurred");
    return Promise.reject(error);
  }
);

const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    return {
      data: response.data,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error
    };
  }
};

export const ApiService = {
  login: (loginBody) => handleApiCall(() => api.post('/auth/login', loginBody)),
  //Product
  fetchProducts: ({
      page,
      size,
      search,
      sort,
      sortDirection
    }) =>
    handleApiCall(() =>
      api.get('/products', {
        params: {
          page,
          size,
          search,
          sort,
          sortDirection
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    ),
  addProduct: (product) =>
    handleApiCall(() =>
      api.post('/products', product, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    ),

  updateProduct: (productId, product) =>
    handleApiCall(() =>
      api.put(`/products/${productId}`, product, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    ),

  deleteProduct: (productId) =>
    handleApiCall(() =>
      api.delete(`/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    ),
  //Location
  addLocation: (location) =>
    handleApiCall(() =>
      api.post('/location', location, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    ),

  updateLocation: (locationId, location) =>
    handleApiCall(() =>
      api.put(`/location/${locationId}`, location, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    ),
  deleteLocation: (locationId) =>
    handleApiCall(() =>
      api.delete(`/location/${locationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    ),
  fetchLocations: ({
      page,
      size,
      search,
      sort,
      sortDirection
    }) =>
    handleApiCall(() =>
      api.get('/location', {
        params: {
          page,
          size,
          search,
          sort,
          sortDirection
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    ),
  getLocationById: (locationId) =>
    handleApiCall(() =>
      api.get(`/location/${locationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    ),
  //Metadata
  fetchProductCategories: () =>
    handleApiCall(() =>
      api.get('/metadata/product-categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    ),

  fetchRotations: () =>
    handleApiCall(() =>
      api.get('/metadata/rotations', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    ),
  //Reception
  startReceptionWithBatches: (batchCreationDtos, receptionDate) =>
    handleApiCall(() =>
      api.post('/reception/start-with-batches', {
        batchCreationDtos,
        receptionDate
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    ),

    storeBatchInLocationReception: (receptionMasterId, batchId, locationId, quantity) =>
      handleApiCall(() =>
        api.post(`/reception/${receptionMasterId}/store?batchId=${batchId}&locationId=${locationId}&quantity=${quantity}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        })
      ),
  fetchReceptionMasters: ({
      processFinished
    }) =>
    handleApiCall(() =>
      api.get('/reception/search', {
        params: {
          processFinished
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    ),
  fetchActiveReceptions: () =>
    handleApiCall(() =>
      api.get('/reception/active', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    ),
  fetchAvailableBatches: (receptionMasterId) =>
    handleApiCall(() =>
      api.get(`/batches/reception/${receptionMasterId}/available`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    ),
    //Storage
    getBatchesByLocation: (locationId) =>
  handleApiCall(() =>
    api.get(`/batches/location/${locationId}/batches`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  ),

  moveBatch: (batchId, sourceLocationId, targetLocationId, quantity) =>
  handleApiCall(() =>
    api.post(`/batches/move?batchId=${batchId}&sourceLocationId=${sourceLocationId}&targetLocationId=${targetLocationId}&quantity=${quantity}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    })
  ),
  //Dispatch
  createDispatchMaster: (pickingOrderId) =>
    handleApiCall(() =>
      api.post('/dispatches/create', null, {
        params: { pickingOrderId },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
    ),
  getDispatchMasterByPickingOrderId: (pickingOrderId) =>
    handleApiCall(() =>
        api.get(`/dispatches/by-picking-order/${pickingOrderId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
    ),
  getPickingOrderDetailsByDispatchMasterId: (dispatchMasterId) =>
    handleApiCall(() =>
        api.get(`/dispatches/${dispatchMasterId}/picking-order-details`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
    ),
  updateDispatchMaster: (dispatchMasterId, updateRequest) =>
    handleApiCall(() =>
      api.put(`/dispatches/update/${dispatchMasterId}`, updateRequest, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
    ),
  dispatchPickingOrder: (pickingOrderId, batchId, locationId, quantity) =>
    handleApiCall(() =>
      api.post(`/dispatches/pickup?pickingOrderId=${pickingOrderId}&batchId=${batchId}&locationId=${locationId}&quantity=${quantity}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
    ),
  getStoragesForDispatch: (productId) =>
    handleApiCall(() =>
      api.get(`/dispatches/dispatch/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
    ),
  //Picking Orders
  createPickingOrder: (dto) =>
  handleApiCall(() =>
  api.post('/picking-orders', dto, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
  ),
  addPickingOrderDetail: (pickingOrderId, pickingOrderDetail) =>
  handleApiCall(() =>
    api.post(`/picking-orders/${pickingOrderId}/details`, pickingOrderDetail, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
  ),
  getPickingOrderDetails: (pickingOrderId) =>
  handleApiCall(() =>
    api.get(`/picking-orders/${pickingOrderId}/details`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
  ),
  getPickingOrdersByDispatched: (dispatched) =>
  handleApiCall(() =>
    api.get('/picking-orders/search', {
      params: { dispatched },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
  ),
  getActivePickingOrders: () =>
  handleApiCall(() =>
    api.get('/picking-orders/active', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
  ),
};

export default ApiService;