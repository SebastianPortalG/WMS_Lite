import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Typography, TextField, Autocomplete, Box } from '@mui/material';
import QrScanner from 'qr-scanner';
import ApiService from '../../service/ApiService';

const ScanStoragePage = () => {
    const { dispatchMasterId, pickingOrderId, productId, locationId } = useParams();
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [location, setLocation] = useState(null);
    const [quantity, setQuantity] = useState('');
    const videoRef = useRef(null);
    const qrScannerRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);
    const navigate = useNavigate();
    

    useEffect(() => {
        if (!locationId || !location) {
          qrScannerRef.current = new QrScanner(videoRef.current, result => handleScanComplete(result), error => {
            
          });
    
          return () => qrScannerRef.current.stop();
    
        }
      }, []);
      useEffect(() => {
        if (location) {
            fetchBatchesByLocation(location);
        }
      }, [location]);
      useEffect(() => {
        if (locationId) {
            fetchBatchesByLocation(locationId);
        }
      }, [locationId]);

    const fetchBatchesByLocation = async (locationId) => {
        const { data, error } = await ApiService.getBatchesByLocation(locationId);
        if (!error) {
            setBatches(data);
        } else {
            console.error("Failed to fetch batches:", error);
        }
    };

    const handleScanComplete = (data) => {
        qrScannerRef.current.stop();
        setIsScanning(false);
        setLocation(data)
        fetchBatchesByLocation(data);
      };
      const startScanning = () => {
        setLocation(null);
        setIsScanning(true);
        qrScannerRef.current.start();
      };

    const handleConfirm = async () => {
        if (selectedBatch && quantity) {
            const { error } = await ApiService.dispatchPickingOrder(pickingOrderId, selectedBatch.batchId, location, quantity);
            if (!error) {
                navigate(`/dispatch-storage/${dispatchMasterId}/${pickingOrderId}`);
            } else {
                console.error("Failed to dispatch:", error);
            }
        }
    };

    return (
        <Container>
            {!location && (
                <>
                <Typography variant="h5" gutterBottom>Ubique el código QR</Typography>
                <Button variant="contained" onClick={startScanning} disabled={isScanning} sx={{ mb: 2 }}>
                    Escanear
                </Button>
                </>
            )}
            {location && <>
            <Autocomplete
                options={batches}
                getOptionLabel={(option) => `${option.productName} - Exp: ${option.expiryDate}`}
                onChange={(event, value) => setSelectedBatch(value)}
                renderInput={(params) => <TextField {...params} label="Seleccionar Lote" variant="outlined" />}
            />
            <TextField
                label="Cantidad"
                type="number"
                fullWidth
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
            <Box mt={2}>
                <Button onClick={handleConfirm} variant="contained" color="primary">Confirmar</Button>
            </Box>
            </>}
            <video ref={videoRef} style={{ width: '100%', marginBottom: '20px' }} />
        </Container>
    );
};

export default ScanStoragePage;
