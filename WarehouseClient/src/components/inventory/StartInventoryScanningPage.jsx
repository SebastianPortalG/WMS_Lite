import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography, Container, Modal, Box, TextField, Snackbar, Alert } from '@mui/material';
import QrScanner from 'qr-scanner';
import ApiService from '../../service/ApiService';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%', // Responsive width
    maxWidth: 600, // Maximum width
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const StartInventoryScanningPage = () => {
  const { inventoryMasterId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [description, setDescription] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    //fetchInventoryMaster();
    qrScannerRef.current = new QrScanner(videoRef.current, result => handleScanComplete(result), error => {
      console.error("QR Scan Error:", error);
    });

    return () => qrScannerRef.current.stop();
  }, []);

  const fetchInventoryMaster = async () => {
    const { data, error } = await ApiService.getInventoryMasterById(inventoryMasterId);
    if (!error && data) {
      setDescription(data.description);
    } else {
      console.error("Failed to fetch inventory master:", error);
    }
  };

  const handleScanComplete = (data) => {
    qrScannerRef.current.stop();
    setIsScanning(false);
    fetchLocation(data);
  };

  const startScanning = () => {
    setIsScanning(true);
    qrScannerRef.current.start();
  };

  const fetchLocation = async (locationId) => {
    const { data, error } = await ApiService.getLocationById(locationId);
    if (!error && data) {
      navigate(`/inventory-scan/${inventoryMasterId}/${locationId}`);
    } else {
      setShowErrorModal(true);
      console.error("Failed to fetch location:", error);
    }
  };

  const handleEndInventory = async () => {
    const { error } = await ApiService.updateInventoryMaster(inventoryMasterId, { description, inventoryFinished: true });
    if (!error) {
      showSnackbar("Inventario finalizado correctamente.", "success");
      // Optionally notify another user
      setShowDescriptionModal(false);
      navigate('/inventory');
    } else {
      showSnackbar("Error al finalizar el inventario.", "error");
      console.error("Failed to end inventory:", error);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDescriptionModal = () => setShowDescriptionModal(true);
  const handleCloseDescriptionModal = () => setShowDescriptionModal(false);

  return (
    <Container sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Escanear Ubicación para Inventario</Typography>
      <Button variant="contained" onClick={startScanning} disabled={isScanning} sx={{ mb: 2 }}>
        Escanear
      </Button>
      <video ref={videoRef} style={{ width: '100%', marginBottom: '20px' }} />
      <Button
        variant="contained"
        color="error"
        onClick={handleOpenDescriptionModal}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        Finalizar Inventario
      </Button>
      <Modal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        aria-labelledby="modal-error-title"
        aria-describedby="modal-error-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ bgcolor: 'background.paper', p: 4, boxShadow: 24, width: 300 }}>
          <Typography id="modal-error-title" variant="h6">
            Error
          </Typography>
          <Typography id="modal-error-description" sx={{ mt: 2 }}>
            No se pudo encontrar la ubicación. Inténtalo de nuevo.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowErrorModal(false)} color="primary">Cerrar</Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={showDescriptionModal}
        onClose={handleCloseDescriptionModal}
        aria-labelledby="modal-description-title"
        aria-describedby="modal-description-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={modalStyle}>
          <Typography id="modal-description-title" variant="h6" component="h2">
            Modificar Descripción
          </Typography>
          <TextField
            label="Descripción"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={4}  
            sx={{ mb: 2 }}  
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleCloseDescriptionModal} sx={{ mr: 1 }}>Cancelar</Button>
            <Button onClick={handleEndInventory} variant="contained">Guardar y Finalizar</Button>
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

export default StartInventoryScanningPage;
