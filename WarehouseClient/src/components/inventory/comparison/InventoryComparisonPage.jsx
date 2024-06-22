import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../../../service/ApiService';
import GenericTable from '../../common/GenericTable';
import { Typography, Container, styled, Paper, Box } from '@mui/material';

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

const columns = [
  { field: 'productCode', headerName: 'Código del producto', width: 200 },
  { field: 'location', headerName: 'Ubicación', width: 250 },
  { field: 'inventoryQuantity', headerName: 'Cantidad en Inventario', width: 200 },
  { field: 'storageQuantity', headerName: 'Cantidad en Almacen', width: 200 },
  { field: 'difference', headerName: 'Diferencia', width: 150 },
];

const InventoryComparisonPage = () => {
  const { inventoryMasterId } = useParams();
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalInventoryQuantity, setTotalInventoryQuantity] = useState(0);
  const [totalStorageQuantity, setTotalStorageQuantity] = useState(0);
  const [totalDifference, setTotalDifference] = useState(0);

  useEffect(() => {
    const fetchComparisonData = async () => {
      setLoading(true);
      const { data, error } = await ApiService.compareInventory(inventoryMasterId);
      if (!error) {
        setComparisonData(data);

        const totalInventoryQty = data.reduce((acc, item) => acc + (item.inventoryQuantity || 0), 0);
        const totalStorageQty = data.reduce((acc, item) => acc + (item.storageQuantity || 0), 0);
        const totalDiff = totalInventoryQty - totalStorageQty;

        setTotalInventoryQuantity(totalInventoryQty);
        setTotalStorageQuantity(totalStorageQty);
        setTotalDifference(totalDiff);
      }
      setLoading(false);
    };
    fetchComparisonData();
  }, [inventoryMasterId]);

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper elevation={6}>
        <Box p={3} style={{ width: '100%' }}>
          <Typography variant="h4" component="h1" marginBottom={2}>
            Comparación de Inventario
          </Typography>
          <Typography variant="h6" component="h2" marginBottom={2}>
            Cantidad Total en Inventario: {totalInventoryQuantity}
          </Typography>
          <Typography variant="h6" component="h2" marginBottom={2}>
            Cantidad Total en Almacén: {totalStorageQuantity}
          </Typography>
          <Typography variant="h6" component="h2" marginBottom={2}>
            Diferencia Total: {totalDifference}
          </Typography>
          <GenericTable
            columns={columns}
            rows={comparisonData}
            loading={loading}
            pageSize={10}
            getRowId={(row) => `${row.productCode}-${row.location}`}
            disablePagination
          />
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
};

export default InventoryComparisonPage;
