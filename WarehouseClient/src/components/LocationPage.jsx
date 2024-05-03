import React, { useEffect, useState } from 'react';
import ApiService from '../service/ApiService';
import GenericTable from './common/GenericTable';
import { Typography, Container, styled, TextField, Button, Paper, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteDialog from './common/DeleteDialog';
import LocationForm from './LocationForm';

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



const locationColumns = [
    { field: 'locationId', headerName: 'ID', width: 100 },
    { field: 'zone', headerName: 'Zona', width: 150 },
    { field: 'aisle', headerName: 'Pasillo', width: 150 },
    { field: 'shelf', headerName: 'Estante', width: 150 },
    { field: 'capacity', headerName: 'Capacidad', width: 150 },
    { field: 'capacityUnit', headerName: 'Unidad', width: 60 },
];

const LocationsPage = () => {
    const { page, size } = useParams();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('zone');
    const [sortDirection, setSortDirection] = useState('ASC');
    const [openForm, setOpenForm] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [rowCount, setRowCount] = useState();
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [locationToDelete, setLocationToDelete] = useState(null);
    const navigate = useNavigate();


    const handleSort = (sortField, sortDir) => {
        setSort(sortField);
        setSortDirection(sortDir);
    };

    const fetchLocations = async () => {
        setLoading(true);
        const { data, error } = await ApiService.fetchLocations({
            page: page || 0,
            size: size || 10,
            search,
            sort,
            sortDirection
        });
        if (!error) {
            setLocations(data.content);
            setRowCount(data.totalElements);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLocations();
    }, [page, size]);

    const handleAddClick = () => {
        setSelectedLocation(null);
        setOpenForm(true);
    };

    const handleEdit = (location) => {
        setSelectedLocation(location);
        setOpenForm(true);
    };

    const handleDelete = (location) => {
        setLocationToDelete(location);
        setConfirmDeleteOpen(true);
    };
    const handlePaginationModelChange = (model) => {
        navigate(`/locations/${model.page}/${model.pageSize}`);
    };
    const handleConfirmDelete = async () => {
        await ApiService.deleteLocation(locationToDelete.locationId);
        setConfirmDeleteOpen(false);
        fetchLocations();
    };

    return (
        <StyledContainer maxWidth="md">
            <Box display="flex" justifyContent="flex-end" width="100%" mb={2}>
                <Button variant="contained" onClick={handleAddClick} endIcon={<AddIcon />}>
                    Agregar
                </Button>
            </Box>
            <StyledPaper elevation={6}>
                <Box p={3} style={{ width: '100%' }}>
                    <Typography variant="h4" component="h1" marginBottom={2}>
                        Ubicaciones
                    </Typography>
                    <GenericTable
                        columns={locationColumns}
                        rows={locations}
                        loading={loading}
                        pageSize={parseInt(size) || 10}
                        onPageChange={(newPage) => {
                            console.log('test')
                            navigate(`/locations/${newPage}/${size || 10}`)
                        }}
                        onPaginationModelChange={handlePaginationModelChange}
                        onPageSizeChange={(newPageSize) => navigate(`/locations/${page || 0}/${newPageSize}`)}
                        page={parseInt(page)}
                        onSort={handleSort}
                        getRowId={(row) => row.locationId}
                        autoHeight={true}
                        rowCount={rowCount}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        showActions={true}
                    />
                    {openForm && (
                        <LocationForm
                            open={openForm}
                            onClose={() => setOpenForm(false)}
                            onSave={fetchLocations}
                            initialData={selectedLocation}
                        />
                    )}
                    {confirmDeleteOpen && (
                        <ConfirmDialog
                            open={confirmDeleteOpen}
                            onClose={() => setConfirmDeleteOpen(false)}
                            onConfirm={handleConfirmDelete}
                            item={locationToDelete}
                        />
                    )}
                </Box>
            </StyledPaper>
        </StyledContainer>
    );
};

export default LocationsPage;
