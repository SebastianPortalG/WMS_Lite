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


const StartReceptionPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [batches, setBatches] = useState([]);
  const[search,setSearch] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(search||'');
  }, [search]);

  const fetchProducts = async (search) => {
    const { data, error } = await ApiService.fetchProducts({
      page: 0, size: 50,search: search,sort: null,sortDirection: null});
    if (!error) {
      setProducts(data.content);
    } else {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleProductChange = (_, value) => {
    setSelectedProduct(value);
  };

  const handleAddBatch = () => {
    if (selectedProduct) {
      if (batches.length > 0) {
        const lastBatch = batches[batches.length - 1];
        if (!lastBatch.quantity || !lastBatch.expiryDate) {
          showSnackbar("Please complete the details of the current batch before adding another.", "warning");
          return;
        }
        const duplicate = batches.slice(0, -1).some(batch =>
          batch.product.productId === lastBatch.product.productId &&
          batch.expiryDate === lastBatch.expiryDate
        );
        if (duplicate) {
          showSnackbar("A batch with the same product and expiry date already exists.", "error");
          return;
        }
      }
      setBatches([...batches, {
        product: selectedProduct,
        quantity: '',
        expiryDate: '',
        isEditing: true
      }]);
      setSelectedProduct(null); // Allow for a new batch entry
    }
};

  const handleDeleteBatch = (index) => {
    const newBatches = batches.filter((_, idx) => idx !== index);
    setBatches(newBatches);
  };

  const handleSaveReception = () => {
    
    if (batches.length > 0) {
        const lastBatch = batches[batches.length - 1];
        if (!lastBatch.quantity || !lastBatch.expiryDate) {
            showSnackbar("Please complete the details of the current batch before saving.", "warning");
            return;
        }
        const duplicate = batches.slice(0, -1).some(batch =>
            batch.product.productId === lastBatch.product.productId &&
            batch.expiryDate === lastBatch.expiryDate
        );
        if (duplicate) {
            showSnackbar("A batch with the same product and expiry date already exists.", "error");
            return;
        }
    }

    
    if (batches.length > 0) {
        setShowConfirmModal(true);
    } else {
        showSnackbar("No batches to save.", "warning");
    }
};


  const handleConfirmSave = async () => {
    const receptionDate = new Date().toISOString();
    try {
      const { response, error }  = await ApiService.startReceptionWithBatches(batches.map(({ product, quantity, expiryDate }) => ({
        productId: product.productId,
        quantity,
        expiryDate
      })), receptionDate);
      if (!error) { 
        navigate('/reception');
      } else {
        console.error("Failed to save reception with response:", response);
        showSnackbar("Failed to save reception due to server error.", "error");
      }
    } catch (error) {
      console.error("Error saving reception:", error);
      showSnackbar("Failed to save reception due to server error.", "error");
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
    <Container maxWidth="md" sx={{ pt: 4}}>
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
        {batches.map((batch, index) => (
          <Grid item xs={12} key={index} component={Paper} elevation={2} sx={{ p: 2, m: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography sx={{ width: '20%', pl: 2 }}>{batch.product.name}</Typography>
            <TextField
              fullWidth
              sx={{ width: '25%', mx: 1 }}
              value={batch.quantity}
              onChange={(e) => {
                const newBatches = [...batches];
                newBatches[index].quantity = e.target.value.replace(/[^0-9]/g, ''); // Only natural numbers
                setBatches(newBatches);
              }}
              placeholder="Quantity"
              disabled={!batch.isEditing}
            />
            <TextField
              type="datetime-local"
              sx={{ width: '45%', mx: 1 }}
              value={batch.expiryDate}
              onChange={(e) => {
                const newBatches = [...batches];
                  const date = new Date(e.target.value);
                  const now = new Date();
                  if (date > now) { 
                    newBatches[index].expiryDate = e.target.value;
                    setBatches(newBatches);
                  }
              }}
              placeholder="Expiry Date"
              disabled={!batch.isEditing}
            />
            <IconButton onClick={() => handleDeleteBatch(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button onClick={handleAddBatch} startIcon={<AddBoxIcon />} sx={{ width: '100%' }}>Recibir lote</Button>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={handleSaveReception} sx={{ width: '100%', mt: 1 }}>Guardar y confirmar</Button>
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
                  Confirmar Recepción
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  ¿Quiere guardar los lotes recibidos?
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

export default StartReceptionPage;
