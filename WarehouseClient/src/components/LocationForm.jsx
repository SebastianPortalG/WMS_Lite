import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const LocationForm = ({ open, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        zone: '',
        aisle: '',
        shelf: '',
        capacity: ''
    });

    useEffect(() => {
        console.log(initialData);
        if (initialData) {
            setFormData({
                zone: initialData.zone,
                aisle: initialData.aisle,
                shelf: initialData.shelf,
                capacity: initialData.capacity,
                capacityUnit: initialData.capacityUnit
            });
        } else {
            setFormData({
                zone: '',
                aisle: '',
                shelf: '',
                capacity: '',
                capacityUnit: ''
            });
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (initialData) {
            await ApiService.updateLocation(initialData.locationId, formData);
        } else {
            await ApiService.addLocation(formData);
        }
        onSave();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{initialData ? 'Editar ubicación' : 'Agregar nueva ubicación'}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Zona"
                    fullWidth
                    value={formData.zone}
                    onChange={(e) => handleChange('zone', e.target.value)}
                    margin="dense"
                />
                <TextField
                    label="Pasillo"
                    fullWidth
                    value={formData.aisle}
                    onChange={(e) => handleChange('aisle', e.target.value)}
                    margin="dense"
                />
                <TextField
                    label="Casillero"
                    fullWidth
                    value={formData.shelf}
                    onChange={(e) => handleChange('shelf', e.target.value)}
                    margin="dense"
                />
                <TextField
                    label="Capacidad"
                    fullWidth
                    value={formData.capacity}
                    onChange={(e) => handleChange('capacity', e.target.value)}
                    type="number"
                    margin="dense"
                />
                <TextField
                    label="Unidad"
                    fullWidth
                    value={formData.capacityUnit}
                    onChange={(e) => handleChange('capacityUnit', e.target.value)}
                    margin="dense"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LocationForm;
