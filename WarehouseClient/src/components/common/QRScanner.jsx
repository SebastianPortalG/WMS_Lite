import React, { useState } from 'react';
import { Button, Container, Typography, Snackbar } from '@mui/material';
import { QrReader } from 'react-qr-reader';

const QRScanner = ({ onScanComplete }) => {
    const [scanResult, setScanResult] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [scanning, setScanning] = useState(false);

    const handleScan = data => {
        if (data) {
            setScanResult(data);
            onScanComplete(data);
            setMessage('QR Code Scanned Successfully!');
            setOpen(true);
            setScanning(false); // Stop scanning after successful scan
        }
    };

    const handleError = err => {
        console.error(err);
        setMessage('Scanning Error. Please try again.');
        setOpen(true);
        setScanning(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const startScanning = () => {
        setScanning(true);
    };

    return (
        <Container>
            <Typography variant="h6">Scan QR Code</Typography>
            {scanning && (
                <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                />
            )}
            {!scanning && (
                <Button onClick={startScanning} variant="contained" color="primary">
                    Start Scanning
                </Button>
            )}
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={message}
            />
        </Container>
    );
};

export default QRScanner;
