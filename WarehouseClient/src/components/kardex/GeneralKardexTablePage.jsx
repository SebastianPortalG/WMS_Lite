import React, { useEffect, useState } from 'react';
import ApiService from '../../service/ApiService';
import GenericTable from '../common/GenericTable';
import { Typography, Container, styled, TextField, Paper, Box, MenuItem } from '@mui/material';

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
    { field: 'type', headerName: 'Tipo de Operación', width: 350 },
    { field: 'code', headerName: 'Código del producto', width: 550 },
    { field: 'date', headerName: 'Fecha de la operacion', width: 250 },
    { field: 'quantity', headerName: 'Cantidad', width: 150 },
    { field: 'expiryDate', headerName: 'Vencimiento', width: 200 },
];

const GeneralKardexTablePage = () => {
    const [kardex, setKardex] = useState([]);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [totalQuantity, setTotalQuantity] = useState(0);

    const fetchKardex = async (productId) => {
        setLoading(true);
        const { data, error } = productId
            ? await ApiService.fetchKardexByProductId(productId)
            : await ApiService.fetchKardexForWarehouse();
        if (!error) {
            const total = data.find(item => item.type === 'Total');
            setTotalQuantity(total ? total.quantity : 0);
            setKardex(data.filter(item => item.type !== 'Total'));
        }
        setLoading(false);
    };

    const fetchProducts = async () => {
        const { data, error } = await ApiService.fetchProducts({ page: 0, size: 100 });
        if (!error) {
            setProducts(data.content);
        }
    };

    useEffect(() => {
        fetchKardex(selectedProduct);
    }, [selectedProduct]);

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <StyledContainer maxWidth="md">
            <StyledPaper elevation={6}>
                <Box p={3} style={{ width: '100%' }}>
                    <Typography variant="h4" component="h1" marginBottom={2}>
                        Operaciones
                    </Typography>
                    <TextField
                        select
                        label="Seleccionar Producto"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        variant="outlined"
                        style={{ marginBottom: 20, width: '50%' }}
                    >
                        <MenuItem value="">
                            <em>Todo</em>
                        </MenuItem>
                        {products.map((product) => (
                            <MenuItem key={product.productId} value={product.productId}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Typography variant="h6" component="h2" marginBottom={2}>
                        Total: {totalQuantity}
                    </Typography>
                    <GenericTable
                        columns={columns}
                        rows={kardex}
                        loading={loading}
                        pageSize={10}
                        getRowId={(row) => row.code + row.date}
                    />
                </Box>
            </StyledPaper>
        </StyledContainer>
    );
};

export default GeneralKardexTablePage;
