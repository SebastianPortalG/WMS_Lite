import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogTitle, DialogContent, TextField, Button, Autocomplete, Checkbox, FormControlLabel } from '@mui/material';
import ApiService from '../service/ApiService';

function ProductForm({ open, onClose, onSave, product }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: null,
    rotation: null,
    consumable: true,
    expires: true,
    active: true
  });
  const [categories, setCategories] = useState([]);
  const [rotations, setRotations] = useState([]);

  useEffect(() => {
    async function fetchMetadata() {
      const catResponse = await ApiService.fetchProductCategories();
      const rotResponse = await ApiService.fetchRotations();
      setCategories(catResponse.data || []);
      setRotations(rotResponse.data || []);
    }
    fetchMetadata();
  }, []);

  useEffect(() => {
    console.log(product)
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        rotation: product.rotation,
        consumable: product.consumable,
        expires: product.expires,
        active: product.active
        // description: '',
        // category: null,
        // rotation: null,
        // consumable: true,
        // expires: true,
        // active: true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: null,
        rotation: null,
        consumable: true,
        expires: true,
        active: true
      });
    }
  }, [product]);


  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (product) {
      await ApiService.updateProduct(product.productId, formData);
    } else {
      await ApiService.addProduct(formData);
    }
    onSave();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{product ? 'Editar Producto' : 'Agregar nuevo producto'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          fullWidth
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          margin="dense"
        />
        <TextField
          label="Descripcion"
          fullWidth
          multiline
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          margin="dense"
        />
        <Autocomplete
          options={categories}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Categoría" margin="dense" />}
          value={formData.category}
          onChange={(_, newValue) => handleChange('category', newValue)}
        />
        <Autocomplete
          options={rotations}
          getOptionLabel={(option) => option.rotacion}
          renderInput={(params) => <TextField {...params} label="Rotación" margin="dense" />}
          value={formData.rotation}
          onChange={(_, newValue) => handleChange('rotation', newValue)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.consumable}
              onChange={(e) => handleChange('consumable', e.target.checked)}
            />
          }
          label="¿Bien De Consumo Final?"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.expires}
              onChange={(e) => handleChange('expires', e.target.checked)}
            />
          }
          label="¿Perecedero?"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.active}
              onChange={(e) => handleChange('active', e.target.checked)}
            />
          }
          label="Activo?"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} >Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductForm;
