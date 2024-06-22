import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, MenuItem, Paper, Select, Typography } from '@mui/material';
import ApiService from '../../../service/ApiService';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  maxWidth: '100% !important',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: `${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(1)}px`,
  width: '100%',
  overflow: 'auto',
}));

const InventorySelector = () => {
  const [inventories, setInventories] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventories = async () => {
      const { data, error } = await ApiService.fetchFinishedInventoryMasters(true);
      if (!error) {
        setInventories(data);
      }
    };
    fetchInventories();
  }, []);

  const handleSelectChange = (event) => {
    setSelectedInventory(event.target.value);
  };

  const handleCompareClick = () => {
    navigate(`/inventory-comparison/${selectedInventory}`);
  };

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper elevation={6}>
        <Box p={3} style={{ width: '100%' }}>
          <Typography variant="h4" component="h1" marginBottom={2}>
            Seleccionar Inventario para Comparar
          </Typography>
          <Select
            fullWidth
            value={selectedInventory || ''}
            onChange={handleSelectChange}
            displayEmpty
            renderValue={selectedInventory !== '' ? undefined : () => "Seleccione un Inventario"}
          >
            {inventories.map((inventory) => (
              <MenuItem key={inventory.id} value={inventory.id}>
                {inventory.description} - {new Date(inventory.inventoryDate).toLocaleDateString()}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCompareClick}
            disabled={!selectedInventory}
            style={{ marginTop: '20px' }}
          >
            Comparar Inventario
          </Button>
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
};

export default InventorySelector;
