import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography, Container, Autocomplete, TextField, Modal, Box } from '@mui/material';
import QrScanner from 'qr-scanner';
import ApiService from '../service/ApiService';

const StoragePage = () => {
  const { sourceLocationId, targetLocationId } = useParams();

  console.log(sourceLocationId, targetLocationId)
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const qrScannerTargetRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [source, setSource] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [targetLocation, setTargetLocation] = useState(null);
  const [isScanningTarget, setIsScanningTarget] = useState(false);

  useEffect(() => {
    qrScannerRef.current = new QrScanner(videoRef.current, result => handleScanComplete(result), error => {
      console.error('QR Scanner Error:', error);
    });

    qrScannerTargetRef.current = new QrScanner(videoRef.current, result => handleScanTargetComplete(result), error => {
      console.error('QR Scanner Error:', error);
    });

    return () => {
      qrScannerRef.current.stop();
      qrScannerTargetRef.current.stop();
    }
  }, []);

  useEffect(() => {
    if (sourceLocationId && !targetLocationId && !isScanningTarget) {
      console.log("Fetching source location and batches", isScanningTarget);
      fetchLocation(sourceLocationId);
      fetchBatches(sourceLocationId);
    } else if (targetLocationId) {
      fetchTargetLocation(targetLocationId);
    }
  }, [sourceLocationId, targetLocationId, isScanningTarget]);

  const handleScanComplete = async (data) => {
    // debugger
    qrScannerRef.current.stop();
    setIsScanning(false);
    console.log("Fetching source location", isScanningTarget);
    await fetchLocation(data);
  };

  const handleScanTargetComplete = (data) => {
    // debugger
    qrScannerTargetRef.current.stop();
    console.log("Fetching target location", isScanningTarget);
    fetchTargetLocation(data);
  };


  const startScanningSource = () => {
    console.log("caso 3")
    setIsScanning(true);
    setIsScanningTarget(false);
    qrScannerRef.current.start();
  };

  const startScanningTarget = () => {
    setIsScanning(true);
    setIsScanningTarget(true);
    console.log("Started scanning target", true);
    qrScannerTargetRef.current.start();
    console.log(sourceLocationId)
  };

  const fetchLocation = async (locationId) => {
    const { data, error } = await ApiService.getLocationById(locationId);
    if (!error) {
      setLocation(data);
      navigate(`/storage/${locationId}`);
      setSource(locationId);
    } else {
      console.error("Failed to fetch location:", error);
    }
  };

  const fetchTargetLocation = async (locationId) => {
    console.log(sourceLocationId, locationId)
    const { data, error } = await ApiService.getLocationById(locationId);
    if (!error) {
      setTargetLocation(data);
      navigate(`/storage/${source}/${locationId}`);
      setIsScanningTarget(false);
      setShowConfirmModal(true);
    } else {
      console.error("Failed to fetch target location:", error);
    }
  };

  const fetchBatches = async (locationId) => {
    const { data, error } = await ApiService.getBatchesByLocation(locationId);
    if (!error) {
      setBatches(data || []);
    } else {
      console.error("Failed to fetch batches:", error);
      setBatches([]);
    }
  };

  const handleConfirmMove = async () => {
    if (quantity > 0 && selectedBatch && targetLocation) {
      const { error } = await ApiService.moveBatch(selectedBatch.batchId, sourceLocationId, targetLocation.locationId, quantity);
      if (!error) {
        alert("Batch moved successfully!");
        setLocation(null);
        setTargetLocation(null);
        setSelectedBatch(null);
        setQuantity('');
        navigate(`/storage`);
      } else {
        console.error("Move failed:", error);
      }
    }
    setShowConfirmModal(false);
  };

  return (
    <Container>
      {!location && !isScanning && (
        <>
          <Typography variant="h5">Escanee el QR donde se encuentra el producto</Typography>
          <Button variant="contained" onClick={() => {console.log("caso 2"); setIsScanningTarget(false); startScanningSource(); }} disabled={isScanning}>
            Scan Source
          </Button>
          <video ref={videoRef} style={{ width: '100%' }} />
        </>
      )}
      {location && !isScanning && !targetLocation && (
        <>
          <Typography variant="h6" sx={{ my: 2 }}>Ubicación:</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Zona: {location.zone}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Pasillo: {location.aisle}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Casillero: {location.shelf}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Capacidad: {location.capacity} {location.capacityUnit}</Typography>
          <Autocomplete
            options={batches}
            getOptionLabel={(option) => `${option.productName} - Disponible: ${option.availableQuantity}` + (option.expiryDate ? ` - Vence: ${new Date(option.expiryDate).toLocaleDateString()}` : '')}
            onChange={(event, value) => setSelectedBatch(value)}
            renderInput={(params) => <TextField {...params} label="Escoger Lote" variant="outlined" />}
          />
          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            inputProps={{
              max: selectedBatch ? selectedBatch.availableQuantity : '',
              min: '1'
            }}
            helperText={selectedBatch ? `Máximo disponible: ${selectedBatch.availableQuantity}` : 'Seleccione un lote para ver la cantidad disponible'}
          />
          <Button variant="contained" color="primary" onClick={() => { setIsScanningTarget(true); startScanningTarget(); }} disabled={isScanning}>
            Escanee el QR donde va a dejar el producto
          </Button>
        </>
      )}
      {targetLocation && (
        <>
          <Typography variant="h6" sx={{ my: 2 }}>Confirmar nueva ubicación:</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Zona: {targetLocation.zone}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Pasillo: {targetLocation.aisle}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Casillero: {targetLocation.shelf}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Capacidad: {targetLocation.capacity} {targetLocation.capacityUnit}</Typography>
          <Button variant="contained" color="primary" onClick={() => setShowConfirmModal(true)}>
            Confirmar Movimiento
          </Button>
        </>
      )}
      <video ref={videoRef} style={{ width: '100%' }} />
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
            ¿Está seguro que desea mover {quantity} unidades de {selectedBatch?.productName} a esta ubicación?
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Zona: {targetLocation?.zone}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Pasillo: {targetLocation?.aisle}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Casillero: {targetLocation?.shelf}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Capacidad: {targetLocation?.capacity} {targetLocation?.capacityUnit}</Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleConfirmMove} color="primary">Sí</Button>
            <Button onClick={() => setShowConfirmModal(false)} color="error" sx={{ ml: 2 }}>No</Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default StoragePage;
