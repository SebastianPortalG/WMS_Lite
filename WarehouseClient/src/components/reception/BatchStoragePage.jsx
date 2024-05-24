import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography, Container, Autocomplete, TextField, Modal, Box } from '@mui/material';
import QrScanner from 'qr-scanner';
import ApiService from '../../service/ApiService';

const BatchStoragePage = () => {
  const { receptionId, locationId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!locationId || !location) {
      qrScannerRef.current = new QrScanner(videoRef.current, result => handleScanComplete(result), error => {
        
      });

      return () => qrScannerRef.current.stop();

    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchAvailableBatches();
    }
  }, [location]);

  useEffect(() => {
    if (locationId) {
      fetchLocation(locationId);
    }
  }, [locationId]);

  const handleScanComplete = (data) => {
    qrScannerRef.current.stop();
    setIsScanning(false);
    fetchLocation(data);
  };

  const startScanning = () => {
    setLocation(null);
    setIsScanning(true);
    qrScannerRef.current.start();
  };

  const fetchLocation = async (locationId) => {
    const { data, error } = await ApiService.getLocationById(locationId);
    if (!error) {
      navigate(`/batch-storage/${receptionId}/${locationId}`);
      setLocation(data);
    } else {
      console.error("Failed to fetch location:", error);
    }
  };

  const fetchAvailableBatches = async () => {
    const { data, error } = await ApiService.fetchAvailableBatches(receptionId);
    if (!error) {
      setBatches(data);
    } else {
      console.error("Failed to fetch batches:", error);
    }
  };

  const handleConfirmStorage = async () => {
    if (quantity > 0 && quantity <= selectedBatch.availableQuantity) {
      console.log(selectedBatch, location,receptionId, quantity);
      const { error } = await ApiService.storeBatchInLocationReception(receptionId, selectedBatch.batchId, location.locationId, quantity);
      if (!error) {
        setLocation(null);
        setQuantity(null);
        navigate(`/batch-storage/${receptionId}`); 
      } else {
        console.error("Storage failed:", error);
      }
    }
    setShowConfirmModal(false);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0 && (!selectedBatch || value <= selectedBatch.availableQuantity)|| value ==null) {
      setQuantity(value.toString());
    } else if (value < 1) {
      setQuantity('1');
    } else if (selectedBatch && value > selectedBatch.availableQuantity) {
      setQuantity(selectedBatch.availableQuantity.toString());
    }
  };

  return (
    <Container sx={{ p: 3 }}>  {/* Increased padding around the container */}
      {!location && (
        <>
          <Typography variant="h5" gutterBottom>Ubique el código QR</Typography>
          <Button variant="contained" onClick={startScanning} disabled={isScanning} sx={{ mb: 2 }}>
            Escanear
          </Button>
        </>
      )}
      {location && (
        <>
          <Typography variant="h6" sx={{ my: 2 }}>Ubicación:</Typography> {/* Increased margin Y for top and bottom space */}
          {/* Location details with added marginBottom */}
          <Typography variant="body1" sx={{ mb: 1 }}>Zona: {location.zone}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Pasillo: {location.aisle}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Casillero: {location.shelf}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Capacidad: {location.capacity} {location.capacityUnit}</Typography>

          <Autocomplete
            options={batches}
            getOptionLabel={(option) => `${option.productName} - Disponibles: ${option.availableQuantity}`}
            onChange={(event, value) => setSelectedBatch(value)}
            renderInput={(params) => <TextField {...params} label="Lote" variant="outlined" sx={{ mb: 2 }} />}
          />
          <TextField
            label="Cantidad a almacenar"
            type="number"
            fullWidth
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{
              max: selectedBatch ? selectedBatch.availableQuantity : '',
              min: '1'
            }}
            sx={{ mb: 2 }} 
          />
          <Button onClick={() => setShowConfirmModal(true)} variant="contained" color="primary" sx={{ mb: 2 }}>
            Almacenar
          </Button>
        </>
      )}
       <video ref={videoRef} style={{ width: '100%', marginBottom: '20px' }} />
      <Modal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ bgcolor: 'background.paper', p: 4, boxShadow: 24, width: 300 }}>
          <Typography id="modal-title" variant="h6">
            Confirmación
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            ¿Está seguro que desea almacenar {quantity} unidades de {selectedBatch?.productName} en esta ubicación?
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleConfirmStorage} color="primary">Sí</Button>
            <Button onClick={() => setShowConfirmModal(false)} color="error" sx={{ ml: 2 }}>No</Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default BatchStoragePage;
