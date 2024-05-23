import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Button, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton,
    TextField, Modal, Box, CircularProgress
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import ApiService from '../../service/ApiService';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const DispatchDetailsPage = () => {
    const { dispatchMasterId, pickingOrderId } = useParams();
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEndDispatchModal, setOpenEndDispatchModal] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [returns, setReturns] = useState([]);
    const [returnQuantity, setReturnQuantity] = useState('');
    const [returnExpiryDate, setReturnExpiryDate] = useState('');
    const [remissionGuide, setRemissionGuide] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDetails();
    }, [dispatchMasterId]);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const { data, error } = await ApiService.getPickingOrderDetailsByDispatchMasterId(dispatchMasterId);
            if (!error) {
                setDetails(data);
            } else {
                console.error('Failed to fetch details:', error);
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScan = (detail) => {
        navigate(`/select-batch/${dispatchMasterId}/${pickingOrderId}/${detail.product.productId}`);
    };

    const handleOpenDeleteModal = (detail) => {
        setSelectedDetail(detail);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setReturnQuantity('');
        setReturnExpiryDate('');
    };

    const handleRemove = () => {
        if (returnQuantity && returnExpiryDate) {
            setReturns([...returns, { ...selectedDetail, returnQuantity, returnExpiryDate }]);
            handleCloseDeleteModal();
        } else {
            console.error('Return quantity and expiry date are required');
        }
    };

    const handlePrint = () => {
        try {
            const doc = new jsPDF();
            doc.text('Dispatch Details', 20, 10);
            const tableData = details.map(detail => [
                detail.product.name,
                detail.quantity,
                detail.pickedQuantity,
                detail.remainingQuantity
            ]);

            doc.autoTable({
                head: [['Producto', 'Cantidad pedida', 'Recogidos', 'Faltantes']],
                body: tableData
            });

            if (returns.length > 0) {
                doc.text('Returns', 20, doc.lastAutoTable.finalY + 10);
                const returnData = returns.map(ret => [
                    ret.product.name,
                    ret.returnQuantity,
                    ret.returnExpiryDate
                ]);

                doc.autoTable({
                    head: [['Producto', 'Cantidad devuelta', 'Fecha de expiración']],
                    body: returnData
                });
            }

            doc.save('dispatch_details.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const handleEndDispatch = async () => {
        if (!remissionGuide || !description) {
            console.error('Remission Guide and Description are required');
            return;
        }

        const leftoverBatches = returns.map(ret => ({
            productId: ret.product.productId,
            quantity: ret.returnQuantity,
            expiryDate: ret.returnExpiryDate
        }));

        const updateRequest = {
            remissionGuide,
            description,
            leftoverBatches
        };

        try {
            const { error } = await ApiService.updateDispatchMaster(dispatchMasterId, updateRequest);
            if (!error) {
                navigate('/dispatch');
            } else {
                console.error('Failed to end dispatch:', error);
            }
        } catch (error) {
            console.error('Error ending dispatch:', error);
        }
    };

    return (
        <Container>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography variant="h4" gutterBottom>
                        Orden de despacho
                    </Typography>
                    <List>
                        {details.map((detail) => (
                            <ListItem key={detail.product.productId}>
                                <ListItemText
                                    primary={`${detail.product.name} - Cantidad: ${detail.quantity} - Recogido: ${detail.pickedQuantity} - Restante: ${detail.remainingQuantity}`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="scan" onClick={() => handleScan(detail)}>
                                        <QrCodeScannerIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteModal(detail)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    <Button variant="contained" color="primary" onClick={handlePrint} startIcon={<PrintIcon />} disabled={loading}>
                        Imprimir
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => setOpenEndDispatchModal(true)} disabled={loading}>
                        Terminar Despacho
                    </Button>

                    <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
                        <Box sx={{ ...modalStyle }}>
                            <Typography variant="h6" gutterBottom>
                                Devolver Cantidad (Agrupar por fecha de vencimiento)
                            </Typography>
                            <TextField
                                label="Cantidad a devolver"
                                type="number"
                                value={returnQuantity}
                                onChange={(e) => setReturnQuantity(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Fecha de vencimiento"
                                type="date"
                                value={returnExpiryDate}
                                onChange={(e) => setReturnExpiryDate(e.target.value)}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <Button variant="contained" color="primary" onClick={handleRemove}>
                                Confirmar
                            </Button>
                        </Box>
                    </Modal>

                    <Modal open={openEndDispatchModal} onClose={() => setOpenEndDispatchModal(false)}>
                        <Box sx={{ ...modalStyle }}>
                            <Typography variant="h6" gutterBottom>
                                Terminar Despacho
                            </Typography>
                            <TextField
                                label="Guía de Remisión"
                                value={remissionGuide}
                                onChange={(e) => setRemissionGuide(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Descripción"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" onClick={handleEndDispatch}>
                                Confirmar
                            </Button>
                        </Box>
                    </Modal>
                </>
            )}
        </Container>
    );
};

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

export default DispatchDetailsPage;
