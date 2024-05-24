import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Button, Modal, Box, Typography, TextField, Autocomplete, Grid, Paper, IconButton, Snackbar, CircularProgress } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';
import ApiService from '../../service/ApiService';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const InventoryScanPage = () => {
  const { inventoryMasterId, locationId } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [search, setSearch] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchLocation(locationId);
      await fetchProducts(search || '');
      setLoading(false);
    };

    fetchData();
  }, [locationId, search]);

  const fetchLocation = async (locationId) => {
    const { data, error } = await ApiService.getLocationById(locationId);
    if (!error) {
      setLocation(data);
    } else {
      console.error("Failed to fetch location:", error);
    }
  };

  const fetchProducts = async (search) => {
    const { data, error } = await ApiService.fetchProducts({
      page: 0, size: 50, search: search, sort: null, sortDirection: null
    });
    if (!error) {
      setProducts(data.content);
    } else {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleProductChange = (_, value) => {
    setSelectedProduct(value);
  };

  const handleAddInventory = () => {
    if (selectedProduct) {
      setInventories([...inventories, {
        product: selectedProduct,
        quantity: '',
        isEditing: true
      }]);
      setSelectedProduct(null);
    }
  };

  const handleDeleteInventory = (index) => {
    const newInventories = inventories.filter((_, idx) => idx !== index);
    setInventories(newInventories);
  };

  const handleSaveInventory = () => {
    if (inventories.length > 0) {
      const lastInventory = inventories[inventories.length - 1];
      if (!lastInventory.quantity) {
        showSnackbar("Complete los detalles para poder guardar.", "warning");
        return;
      }
    }

    if (inventories.length > 0) {
      setShowConfirmModal(true);
    } else {
      showSnackbar("No existen productos para guardar.", "warning");
    }
  };

  const handleConfirmSave = async () => {
    try {
      const inventoryRequest = {
        inventoryMasterId,
        locationId,
        products: inventories.map(({ product, quantity }) => ({
          productId: product.productId,
          quantity
        }))
      };
      const { data, error } = await ApiService.createInventory(inventoryRequest);
      if (!error) {
        navigate(`/inventory-scan/${inventoryMasterId}`);
      } else {
        console.error("Failed to save inventory:", error);
        showSnackbar("Error.", "error");
      }
    } catch (error) {
      console.error("Error saving inventory:", error);
      showSnackbar("Error.", "error");
    }
    setShowConfirmModal(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            {location && (
              <>
                <Typography variant="h6" sx={{ my: 2 }}>Ubicación:</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>Zona: {location.zone}</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>Pasillo: {location.aisle}</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>Casillero: {location.shelf}</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>Capacidad: {location.capacity} {location.capacityUnit}</Typography>
              </>
            )}
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              value={selectedProduct}
              onChange={handleProductChange}
              options={products}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.productId === value.productId}
              style={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="Buscar Productos" variant="outlined" />}
            />
          </Grid>
          {inventories.map((inventory, index) => (
            <Grid item xs={12} key={index} component={Paper} elevation={2} sx={{ p: 2, m: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography sx={{ width: '20%', pl: 2 }}>{inventory.product.name}</Typography>
              <TextField
                fullWidth
                sx={{ width: '25%', mx: 1 }}
                value={inventory.quantity}
                onChange={(e) => {
                  const newInventories = [...inventories];
                  newInventories[index].quantity = e.target.value.replace(/[^0-9]/g, ''); // Only natural numbers
                  setInventories(newInventories);
                }}
                placeholder="Cantidad"
                disabled={!inventory.isEditing}
              />
              <IconButton onClick={() => handleDeleteInventory(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={handleAddInventory} startIcon={<AddBoxIcon />} sx={{ width: '100%' }}>Añadir Producto</Button>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleSaveInventory} sx={{ width: '100%', mt: 1 }}>Guardar y confirmar</Button>
          </Grid>
        </Grid>
      )}
      <Modal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirmar Inventario
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Quiere guardar los productos inventariados?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={() => setShowConfirmModal(false)} sx={{ mr: 1 }}>Cancelar</Button>
            <Button onClick={handleConfirmSave} variant="contained">Confirmar</Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default InventoryScanPage;
