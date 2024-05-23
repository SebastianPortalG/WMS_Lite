import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Button, Box, Typography, styled, Modal } from '@mui/material';
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

const DispatchPage = () => {
  const [open, setOpen] = useState(false);
  const [dispatchStarted, setDispatchStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    handleClose();
    navigate('/start-dispatch');
  };

  useEffect(() => {
    fetchDispatchMaster();
  }, []);

  const fetchDispatchMaster = async () => {
    setLoading(true);
    const { data, error } = await ApiService.getActivePickingOrders();
    setLoading(false);
    if (!error && data) {
      setDispatchStarted(data.length > 0);
    } else {
      console.error("No active dispatches found or error:", error);
    }
  };

  const modalBody = (
    <div>
      <h2 id="simple-modal-title">Confirmar inicio de despacho</h2>
      <p id="simple-modal-description">
        ¿Estás seguro de que quieres comenzar el proceso de despacho y registrar productos?
      </p>
      <Button onClick={handleConfirm}>Confirmar</Button>
      <Button onClick={handleClose}>Cancelar</Button>
    </div>
  );

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
                  Ingresar Orden de Picking
                </Typography>
                <Box mt={2} width="100%">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleOpen}
                    fullWidth
                  >
                    {'Registrar Orden de Picking nueva'}
                  </Button>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={modalStyle}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        Confirmar inicio de despacho
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        ¿Estás seguro de que quieres comenzar el proceso de despacho y registrar productos?
                      </Typography>
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
                  Despachar
                </Typography>
                {dispatchStarted ? (
                  <Box mt={2} width="100%">
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<QrCodeScannerIcon />}
                      onClick={() => navigate('/create-dispatch')}
                      fullWidth
                    >
                      Escanear una orden
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2" mt={2}>
                    Inicie un despacho para activar el escaneo.
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

export default DispatchPage;
