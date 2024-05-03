import React, { useEffect, useState } from 'react';
import ApiService from '../service/ApiService';
import GenericTable from './common/GenericTable';
import { Typography, Container, styled, TextField, Button, Paper, Box, Grid, Modal, IconButton, } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteDialog from './common/DeleteDialog';

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
}));

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};



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
                label="Busque por nombre o descripcion del producto..."
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


const columns = [
    { field: 'productId', headerName: 'ID', width: 10 },
    { field: 'name', headerName: 'Nombre', width: 180 },
    { field: 'description', headerName: 'Descripcion', width: 250, wrapText: true },
    {
        field: 'category',
        headerName: 'Categoria',
        width: 120,
        valueGetter: (params) => params?.name ?? 'N/A'
    },
    { field: 'rotation', headerName: 'Rotacion', flex: 0.3, valueGetter: (params) => params.rotacion ?? 'N/A' },
    { field: 'consumable', headerName: 'Consumible', flex: 0.3, type: 'boolean' },
    { field: 'active', headerName: 'Activo', flex: 0.3, type: 'boolean' },
];


const ProductsPage = () => {
    const { page, size } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('name');
    const [rowCount, setRowCount] = useState();
    const [sortDirection, setSortDirection] = useState('ASC');
    const [openForm, setOpenForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const handleAddClick = () => {
        setSelectedProduct(null);
        setOpenForm(true);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        console.log("Editing product:", selectedProduct);
        setOpenForm(true);
    };

    const handleDelete = (product) => {
        setProductToDelete(product);
        setConfirmDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        await ApiService.deleteProduct(productToDelete.productId);
        setConfirmDeleteOpen(false);
        fetchProducts();
    };
    const handlePaginationModelChange = (model) => {
        navigate(`/products/${model.page}/${model.pageSize}?search=${search}`);
    };


    const navigate = useNavigate();

    const handleSearch = (searchTerm) => {
        setSearch(searchTerm);
        navigate(`/products/${page || 0}/${size || 10}?search=${searchTerm}`);
    };

    const handleSort = (sortField, sortDir) => {
        setSort(sortField);
        setSortDirection(sortDir);
    };

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await ApiService.fetchProducts({
            page: page || 0,
            size: size || 10,
            search,
            sort,
            sortDirection
        });
        if (!error) {
            setProducts(data.content);
            setRowCount(data.totalElements);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, [page, size, search, sort, sortDirection, navigate]);

    return (
        <StyledContainer maxWidth="md">
            <SearchInput onSearch={handleSearch} />
            <Box display="flex" justifyContent="flex-end" width="100%" mb={2}>
                <Button variant="contained" onClick={handleAddClick} endIcon={<AddIcon />}>
                    Agregar
                </Button>
            </Box>
            <StyledPaper elevation={6}>
                <Box p={3} style={{ width: '100%' }} >
                    <Typography variant="h4" component="h1" marginBottom={2}>
                        Productos
                    </Typography>
                    <GenericTable
                        key={`${page}-${size}`}
                        columns={columns}
                        rows={products}
                        loading={loading}
                        pageSize={parseInt(size) || 10}
                        onPageChange={(newPage) => {
                            console.log('test')
                            navigate(`/products/${newPage}/${size || 10}`)
                        }}
                        onPageSizeChange={(newPageSize) => navigate(`/products/${page || 0}/${newPageSize}`)}
                        onPaginationModelChange={handlePaginationModelChange}
                        page={parseInt(page)}
                        onSort={handleSort}
                        getRowId={(row) => row.productId}
                        rowCount={rowCount}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        showActions={true}
                    />
                    {openForm && (
                        <ProductForm
                            open={openForm}
                            onClose={() => setOpenForm(false)}
                            onSave={() => {
                                setOpenForm(false);
                                fetchProducts();
                            }}
                            product={selectedProduct}
                        />
                    )}
                    {confirmDeleteOpen && (
                        <DeleteDialog
                            open={confirmDeleteOpen}
                            onClose={() => setConfirmDeleteOpen(false)}
                            onConfirm={handleConfirmDelete}
                            item={productToDelete}
                        />
                    )}
                </Box>
            </StyledPaper>
        </StyledContainer>
    );
};

export default ProductsPage;
