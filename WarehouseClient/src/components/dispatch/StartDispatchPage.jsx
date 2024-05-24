import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Modal, Box, Typography, TextField, Autocomplete, Grid, Paper, IconButton, Snackbar } from '@mui/material';
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

const StartDispatchPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [pickingOrderDetails, setPickingOrderDetails] = useState([]);
  const [search, setSearch] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(search || '');
  }, [search]);

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

  const handleAddPickingOrderDetail = () => {
    if (selectedProduct) {
      if (pickingOrderDetails.length > 0) {
        const lastDetail = pickingOrderDetails[pickingOrderDetails.length - 1];
        if (!lastDetail.quantity) {
          showSnackbar("Completar los detalles antes de continuar.", "warning");
          return;
        }
        const duplicate = pickingOrderDetails.slice(0, -1).some(detail =>
          detail.product.productId === lastDetail.product.productId
        );
        if (duplicate) {
          showSnackbar("Ya existe el mismo detalle en esta orden.", "error");
          return;
        }
      }
      setPickingOrderDetails([...pickingOrderDetails, {
        product: selectedProduct,
        quantity: '',
        isEditing: true
      }]);
      setSelectedProduct(null);
    }
  };

  const handleDeletePickingOrderDetail = (index) => {
    const newPickingOrderDetails = pickingOrderDetails.filter((_, idx) => idx !== index);
    setPickingOrderDetails(newPickingOrderDetails);
  };

  const handleSavePickingOrder = () => {
    if (pickingOrderDetails.length > 0) {
      const lastDetail = pickingOrderDetails[pickingOrderDetails.length - 1];
      if (!lastDetail.quantity) {
        showSnackbar("Please complete the details of the current picking order before saving.", "warning");
        return;
      }
      const duplicate = pickingOrderDetails.slice(0, -1).some(detail =>
        detail.product.productId === lastDetail.product.productId
      );
      if (duplicate) {
        showSnackbar("A picking order detail with the same product already exists.", "error");
        return;
      }
    }

    if (pickingOrderDetails.length > 0) {
      setShowConfirmModal(true);
    } else {
      showSnackbar("No picking order details to save.", "warning");
    }
  };

  const handleConfirmSave = async () => {
    try {
      const pickingOrderCreationDto = {
        description,
        details: pickingOrderDetails.map(({ product, quantity }) => ({
          productId: product.productId,
          quantity
        }))
      };

      const { data, error } = await ApiService.createPickingOrder(pickingOrderCreationDto);
      if (!error) {
        navigate('/dispatch');
      } else {
        console.error("Failed to save picking order:", data);
        showSnackbar("Failed to save picking order due to server error.", "error");
      }
    } catch (error) {
      console.error("Error saving picking order:", error);
      showSnackbar("Failed to save picking order due to server error.", "error");
    }
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
      <Grid container spacing={2} alignItems="center" justifyContent="center">
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
        {pickingOrderDetails.map((detail, index) => (
          <Grid item xs={12} key={index} component={Paper} elevation={2} sx={{ p: 2, m: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography sx={{ width: '40%', pl: 2 }}>{detail.product.name}</Typography>
            <TextField
              fullWidth
              sx={{ width: '25%', mx: 1 }}
              value={detail.quantity}
              onChange={(e) => {
                const newPickingOrderDetails = [...pickingOrderDetails];
                newPickingOrderDetails[index].quantity = e.target.value.replace(/[^0-9]/g, ''); // Only natural numbers
                setPickingOrderDetails(newPickingOrderDetails);
              }}
              placeholder="Cantidad"
              disabled={!detail.isEditing}
            />
            <IconButton onClick={() => handleDeletePickingOrderDetail(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button onClick={handleAddPickingOrderDetail} startIcon={<AddBoxIcon />} sx={{ width: '100%' }}>Añadir Detalle de Pedido</Button>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={handleSavePickingOrder} sx={{ width: '100%', mt: 1 }}>Guardar y Confirmar</Button>
        </Grid>
      </Grid>
      <Modal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirmar Pedido
          </Typography>
          <TextField
            fullWidth
            label="Descripción"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Quiere guardar los detalles del pedido?
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

export default StartDispatchPage;
