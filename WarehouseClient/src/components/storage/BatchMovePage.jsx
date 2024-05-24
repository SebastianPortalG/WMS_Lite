import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography, Container, Autocomplete, TextField, Modal, Box } from '@mui/material';
import QrScanner from 'qr-scanner';
import ApiService from '../../service/ApiService';

const BatchMovePage = () => {
  const { locationId } = useParams();
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
    qrScannerRef.current = new QrScanner(videoRef.current, result => handleScanComplete(result), error => {
      console.error('QR Scanner Error:', error);
    });

    return () => qrScannerRef.current.stop();
  }, []);

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
      setLocation(data);
      navigate(`/storage/${locationId}`);
      fetchBatches(locationId);
    } else {
      console.error("Failed to fetch location:", error);
    }
  };

  const fetchBatches = async (locationId) => {
    const { data, error } = await ApiService.getBatchesByLocation(locationId);
    if (!error) {
      setBatches(data);
    } else {
      console.error("Failed to fetch batches:", error);
    }
  };

  const handleConfirmMove = async () => {
    const targetLocationId = prompt("Enter the target location ID:");
    if (targetLocationId) {
      const { error } = await ApiService.moveBatch(selectedBatch.batchId, locationId, targetLocationId, quantity);
      if (!error) {
        navigate(`/storage/${locationId}`);
      } else {
        console.error("Move failed:", error);
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
    <Container>
      {!location && (
        <>
          <Typography variant="h5">Escanee el Código de la Ubicación</Typography>
          <Button variant="contained" onClick={startScanning} disabled={isScanning}>
            Start Scanning
          </Button>
          <video ref={videoRef} style={{ width: '100%' }} />
        </>
      )}
      {location && (
        <>
          <Typography variant="h6">Location: {location.name}</Typography>
          <Autocomplete
            options={batches}
            getOptionLabel={(option) => `${option.productName} - Available: ${option.availableQuantity}`}
            onChange={(event, value) => setSelectedBatch(value)}
            renderInput={(params) => <TextField {...params} label="Select Batch" variant="outlined" />}
          />
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <Button onClick={() => setShowConfirmModal(true)} variant="contained" color="primary">
            Confirm Move
          </Button>
        </>
      )}
      <Modal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Confirmar movimiento
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            ¿Está seguro que desea mover {quantity} unidades de {selectedBatch?.productName}?
          </Typography>
          <Button onClick={handleConfirmMove} sx={{ mr: 1 }}>Yes</Button>
          <Button onClick={() => setShowConfirmModal(false)}>No</Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default BatchMovePage;
