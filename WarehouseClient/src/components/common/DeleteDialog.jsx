import React from 'react';
import { Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material';



const DeleteDialog = ({ open, onClose, onConfirm, item }) => {
    const confirmMessage = item.name ? `¿Está seguro que desea volver inactivo: ${item.name}?` : '¿Está seguro que desea eliminar esta ubicación?';
    return(
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {confirmMessage}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">Cancelar</Button>
            <Button onClick={onConfirm} color="secondary">Eliminar</Button>
        </DialogActions>
    </Dialog>);
}

export default DeleteDialog;
