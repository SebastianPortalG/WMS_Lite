import React, { useEffect, useState } from 'react';
import ApiService from '../service/ApiService';
import GenericTable from './common/GenericTable';
import { Typography, Container, styled, TextField, Button, Paper, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

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

const SearchInput = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    return (
        <Box display="flex" mb={2} width={1000}>
            <TextField
                style={{ minWidth: 500 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                label="Buscar por Código, nombre o categoría..."
                variant="outlined"
                onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSearch();
                }}
            />
            <Button onClick={handleSearch} endIcon={<SearchIcon />}>
                Buscar
            </Button>
        </Box>
    );
};

const StorageTablePage = () => {
    const params = useParams();
    const [storages, setStorages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [rowCount, setRowCount] = useState();
    const navigate = useNavigate();

    const page = params.page ? parseInt(params.page) : 0;
    const size = params.size ? parseInt(params.size) : 10;

    const fetchStorages = async () => {
        setLoading(true);
        const { data, error } = await ApiService.fetchStorages({
            code: search, // Adjust as needed for more detailed filtering
            product: search,
            status: search,
            classification: search,
            orderByExpiryDate: true, // Adjust as needed
        });
        if (!error) {
            setStorages(data);
            setRowCount(data.length);
        }
        setLoading(false);
    };

    const handlePaginationModelChange = (model) => {
        navigate(`/storage-list/${model.page}/${model.pageSize}?search=${search}`);
    };

    const handleSearch = (searchTerm) => {
        setSearch(searchTerm);
        fetchStorages();
    };

    useEffect(() => {
        fetchStorages();
    }, [page, size, search]);

    const columns = [
        { 
            field: 'product', 
            headerName: 'Producto', 
            width: 200, 
            renderCell: (params) => {
                return params.row.product?.name || 'N/A';
            }
        },
        { 
            field: 'storedQuantity', 
            headerName: 'Cantidad en ubicación', 
            width: 150 
        },
        { 
            field: 'zone', 
            headerName: 'Zona', 
            width: 150, 
            renderCell: (params) => {
                return params.row.location?.zone || 'N/A';
            }
        },
        { 
            field: 'aisle', 
            headerName: 'Pasillo', 
            width: 150, 
            renderCell: (params) => {
                return params.row.location?.aisle || 'N/A';
            }
        },
        { 
            field: 'shelf', 
            headerName: 'Piso', 
            width: 150, 
            renderCell: (params) => {
                return params.row.location?.shelf || 'N/A';
            }
        },
        { 
            field: 'batchCode', 
            headerName: 'Lote', 
            width: 450, 
            renderCell: (params) => {
                return params.row.batch?.code || 'N/A';
            }
        },
        { 
            field: 'expiryDate', 
            headerName: 'Fecha de caducidad', 
            width: 200, 
            renderCell: (params) => {
                return params.row.batch?.expiryDate ? new Date(params.row.batch.expiryDate).toLocaleDateString() : 'N/A';
            }
        },
    ];

    return (
        <StyledContainer maxWidth="md">
            <SearchInput onSearch={handleSearch} />
            <StyledPaper elevation={6}>
                <Box p={3} style={{ width: '100%' }}>
                    <Typography variant="h4" component="h1" marginBottom={2}>
                        Existencias
                    </Typography>
                    <GenericTable
                        columns={columns}
                        rows={storages}
                        loading={loading}
                        pageSize={size}
                        onPageChange={(newPage) => navigate(`/storage-list/${newPage}/${size}`)}
                        onPageSizeChange={(newPageSize) => navigate(`/storage-list/${page}/${newPageSize}`)}
                        onPaginationModelChange={handlePaginationModelChange}
                        page={page}
                        rowCount={rowCount}
                        getRowId={(row) => row.storageId}
                        showKardexButton={true} // Add this flag
                    />
                </Box>
            </StyledPaper>
        </StyledContainer>
    );
};

export default StorageTablePage;
