import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Button, Box, Typography, styled, Modal, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useNavigate } from 'react-router-dom';
import ApiService from '../service/ApiService';
import CircularProgress from '@mui/material/CircularProgress';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
}));

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

const InventoryPage = () => {
  const [open, setOpen] = useState(false);
  const [inventoryStarted, setInventoryStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchInventoryMasters();
  }, []);

  const fetchInventoryMasters = async () => {
    setLoading(true);
    const { data, error } = await ApiService.fetchInventoryMasters();
    setLoading(false);
    if (!error && data) {
      setInventoryStarted(data.length > 0);
    } else {
      // handle error or no data scenario
      console.error("No active inventories found or error:", error);
    }
  };

  const handleConfirm = async () => {
    handleClose();
    setLoading(true);
    const event = new Date();

    const inventoryDate = event.toJSON();

    const { data, error } = await ApiService.createInventoryMaster({ description, inventoryDate});
    setLoading(false);
    if (!error && data) {
      setInventoryStarted(true);
    } else {
      // handle error scenario
      console.error("Error creating inventory master:", error);
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      <Grid container spacing={3}>
        {loading && (
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Grid>
        )}
        {!loading && (
          <>
            <Grid item xs={12} md={6}>
              <StyledPaper elevation={6}>
                <Typography variant="h6" gutterBottom>
                  Iniciar Inventario
                </Typography>
                <Box mt={2} width="100%">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleOpen}
                    fullWidth
                  >
                    {'Iniciar Inventario'}
                  </Button>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={modalStyle}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        Confirmar inicio de inventario
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        ¿Estás seguro de que quieres comenzar el proceso de inventario?
                      </Typography>
                      <TextField
                        label="Descripción"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button onClick={handleClose} sx={{ mr: 1 }}>Cancelar</Button>
                        <Button onClick={handleConfirm} variant="contained">Confirmar</Button>
                      </Box>
                    </Box>
                  </Modal>
                </Box>
              </StyledPaper>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledPaper elevation={6}>
                <Typography variant="h6" gutterBottom>
                  Escanear Productos para Inventario Existente
                </Typography>
                {inventoryStarted ? (
                  <Box mt={2} width="100%">
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<QrCodeScannerIcon />}
                      onClick={() => navigate('/inventory-scan')}
                      fullWidth
                    >
                      Escanear Productos
                    </Button>
                    <Typography variant="body2" color="textSecondary" mt={2}>
                      {/* ID de Inventario: {inventoryMaster.inventoryMasterId} */}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" mt={2}>
                    Inicie un inventario para activar el escaneo.
                  </Typography>
                )}
              </StyledPaper>
            </Grid>
          </>
        )}
      </Grid>
    </StyledContainer>
  );
};

export default InventoryPage;
