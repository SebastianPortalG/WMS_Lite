import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, CircularProgress, Box } from '@mui/material';
import ApiService from '../../service/ApiService';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

const SelectBatchPage = () => {
    const { dispatchMasterId, pickingOrderId, productId } = useParams();
    const [storages, setStorages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStorages();
    }, [productId]);

    const fetchStorages = async () => {
        setLoading(true);
        try {
            const { data, error } = await ApiService.getStoragesForDispatch(productId);
            if (!error) {
                setStorages(data);
            } else {
                console.error("Failed to fetch storages:", error);
            }
        } catch (error) {
            console.error("Error fetching storages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBatch = () => {
        navigate(`/scan-storage/${dispatchMasterId}/${pickingOrderId}/${productId}`);
    };

    return (
        <Container>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography variant="h4" gutterBottom>
                        Existencias
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        {storages[0]?.batch?.productName}
                        <IconButton edge="end" aria-label="select" onClick={handleSelectBatch}>
                            <QrCodeScannerIcon />
                        </IconButton>
                    </Typography>
                    <List>
                        {storages.map((storage) => (
                            <ListItem key={storage.batch.batchId}>
                                <ListItemText
                                    primary={`Zona: ${storage.location.zone} - 
                                            Pasillo: ${storage.location.aisle} - 
                                            Casillero: ${storage.location.shelf} - 
                                            Vence: ${storage.batch.expiryDate} `}
                                />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </Container>
    );
};

export default SelectBatchPage;
