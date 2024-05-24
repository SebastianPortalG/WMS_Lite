import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Autocomplete, TextField } from '@mui/material';
import ApiService from '../../service/ApiService';

const StartInventoryScanning = () => {
    const [inventories, setInventories] = useState([]);
    const [selectedInventory, setSelectedInventory] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchActiveInventories();
    }, []);

    const fetchActiveInventories = async () => {
        const { data, error } = await ApiService.fetchInventoryMasters();
        if (!error) {
            setInventories(data);
        } else {
            console.error("Failed to fetch inventories:", error);
        }
    };

    const handleInventorySelection = (event, value) => {
        setSelectedInventory(value);
    };

    const handleConfirmInventory = () => {
        if (selectedInventory) {
            navigate(`/inventory-scan/${selectedInventory.id}`);
        }
    };

    return (
        <Container>
            <Typography variant="h6">Escoger el proceso</Typography>
            <Autocomplete
                options={inventories}
                getOptionLabel={(option) => `Id de inventario: ${option.id}, Descripcion: ${option.description}, Fecha: ${option.inventoryDate}`}
                onChange={handleInventorySelection}
                renderInput={(params) => <TextField {...params} label="Escoger el proceso de inventario" />}
            />
            <Button 
                onClick={handleConfirmInventory} 
                color="primary"
                disabled={!selectedInventory}>Confirmar</Button>
        </Container>
    );
};

export default StartInventoryScanning;
