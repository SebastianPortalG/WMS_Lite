import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Autocomplete, TextField } from '@mui/material';
import ApiService from '../../service/ApiService';

const StoreReceptionBatches = () => {
    const [receptions, setReceptions] = useState([]);
    const [selectedReception, setSelectedReception] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchActiveReceptions();
    }, []);

    const fetchActiveReceptions = async () => {
        const { data, error } = await ApiService.fetchActiveReceptions();
        if (!error) {
            setReceptions(data);
        } else {
            console.error("Failed to fetch receptions:", error);
        }
    };

    const handleReceptionSelection = (event, value) => {
        setSelectedReception(value);
    };
    const handleConfirmReception = () => {
        if (selectedReception) {
            navigate(`/batch-storage/${selectedReception.id}`);
        }
    };
      

    return (
        <Container>
            <Typography variant="h6">Store Reception Batches</Typography>
            <Autocomplete
                options={receptions}
                getOptionLabel={(option) => `Id de recepcion: ${option.id}, Fecha: ${option.receptionDate}`}
                onChange={handleReceptionSelection}
                renderInput={(params) => <TextField {...params} label="Escoger el proceso de recepción" />}
            />
            <Button 
                onClick={handleConfirmReception} 
                color="primary"
                disabled ={!selectedReception}>Confirmar</Button>
        </Container>
    );
};

export default StoreReceptionBatches;
