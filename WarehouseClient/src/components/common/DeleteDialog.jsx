import React from 'react';
import { Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material';

const DeleteDialog = ({ open, onClose, onConfirm, item }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
            <DialogContentText>
                ¿Esta seguro que desea eliminar: {item.name}?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">Cancelar</Button>
            <Button onClick={onConfirm} color="secondary">Eliminar</Button>
        </DialogActions>
    </Dialog>
);

export default DeleteDialog;
