import React, { useEffect, useState } from 'react';
import ApiService from '../../service/ApiService';
import GenericTable from '../common/GenericTable';
import { Typography, Container, styled, Paper, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

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

const ProductKardexTablePage = () => {
    const { productId } = useParams();
    const [kardex, setKardex] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [productName, setProductName] = useState('');

    const fetchKardex = async (id) => {
        setLoading(true);
        const { data: kardexData, error: kardexError } = await ApiService.fetchKardexByProductId(id);
        if (!kardexError) {
            const total = kardexData.find(item => item.type === 'Total');
            setTotalQuantity(total ? total.quantity : 0);
            setKardex(kardexData.filter(item => item.type !== 'Total'));
        }
        const { data: productData, error: productError } = await ApiService.getProductById(id);
        if (!productError) {
            setProductName(productData.name);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchKardex(productId);
    }, [productId]);

    return (
        <StyledContainer maxWidth="md">
            <StyledPaper elevation={6}>
                <Box p={3} style={{ width: '100%' }}>
                    <Typography variant="h4" component="h1" marginBottom={2}>
                        Registro del Producto: {productName}
                    </Typography>
                    <Typography variant="h6" component="h2" marginBottom={2}>
                        Cantidad Total: {totalQuantity}
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

export default ProductKardexTablePage;
