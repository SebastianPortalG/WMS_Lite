import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Autocomplete, TextField, Snackbar, Alert } from '@mui/material';
import ApiService from '../../service/ApiService';

const CreateDispatchMaster = () => {
    const [pickingOrders, setPickingOrders] = useState([]);
    const [selectedPickingOrder, setSelectedPickingOrder] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchActivePickingOrders();
    }, []);

    const fetchActivePickingOrders = async () => {
        const { data, error } = await ApiService.getActivePickingOrders();
        if (!error) {
            setPickingOrders(data);
        } else {
            console.error("Failed to fetch picking orders:", error);
        }
    };

    const handlePickingOrderSelection = (event, value) => {
        setSelectedPickingOrder(value);
    };

    const handleConfirmPickingOrder = async () => {
        if (selectedPickingOrder) {
            const { data: existingDispatchMaster, error: fetchError } = await ApiService.getDispatchMasterByPickingOrderId(selectedPickingOrder.pickingOrderId);
            if (!fetchError && existingDispatchMaster) {
                navigate(`/dispatch-storage/${existingDispatchMaster}/${selectedPickingOrder.pickingOrderId}`);
            } else if (fetchError && fetchError.response.status === 404) {
                const { data, error } = await ApiService.createDispatchMaster(selectedPickingOrder.pickingOrderId);
                if (!error) {
                    navigate(`/dispatch-storage/${data.createdId}/${selectedPickingOrder.pickingOrderId}`);
                } else {
                    console.error("Failed to create dispatch master:", error);
                    showSnackbar("Failed to create dispatch master due to server error.", "error");
                }
            } else {
                console.error("Failed to fetch dispatch master:", fetchError);
                showSnackbar("Failed to fetch dispatch master due to server error.", "error");
            }
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const closeSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container>
            <Typography variant="h6">Despachar</Typography>
            <Autocomplete
                options={pickingOrders}
                getOptionLabel={(option) => `Id de Picking: ${option.pickingOrderId}, Descripción: ${option.description}`}
                onChange={handlePickingOrderSelection}
                renderInput={(params) => <TextField {...params} label="Escoger el proceso de picking" />}
            />
            <Button 
                onClick={handleConfirmPickingOrder} 
                color="primary"
                disabled={!selectedPickingOrder}>Confirmar</Button>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CreateDispatchMaster;
