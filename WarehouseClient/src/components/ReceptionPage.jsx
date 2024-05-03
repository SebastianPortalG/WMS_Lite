import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Button, Box, Typography, styled, Modal} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useNavigate } from 'react-router-dom';
import ApiService from '../service/ApiService';
import CircularProgress from '@mui/material/CircularProgress';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
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

const ReceptionPage = () => {
    const [open, setOpen] = useState(false);
    const [receptionStarted, setReceptionStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();

    const handleConfirm = () => {
    handleClose();
    navigate('/start-reception');
    };
    useEffect(() => {
        fetchReceptionMaster();
    }, []);
    
    const fetchReceptionMaster = async () => {
        setLoading(true);
        const { data, error } = await ApiService.fetchReceptionMasters({ processFinished: false });
        setLoading(false);
        if (!error && data) {
            setReceptionStarted(data);
        } else {
            // handle error or no data scenario
            console.error("No active receptions found or error:", error);
        }
    };

    const modalBody = (
        <div>
        <h2 id="simple-modal-title">Confirmar inicio de recepción</h2>
        <p id="simple-modal-description">
            ¿Estás seguro de que quieres comenzar el proceso de recepción y registrar lotes?
        </p>
        <Button onClick={handleConfirm}>Confirmar</Button>
        <Button onClick={handleClose}>Cancelar</Button>
        </div>
    );
        
    return (
        <StyledContainer maxWidth="lg">
        <Grid container spacing={3}>
            {loading && (
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Grid>
            )}
            {!loading && (
                <>
            <Grid item xs={12} md={6}>
            <StyledPaper elevation={6}>
                <Typography variant="h6" gutterBottom>
                Iniciar Recepción
                </Typography>
                <Box mt={2} width="100%">
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleOpen}
                    fullWidth
                >
                    {receptionStarted ? 'Recepción En Curso' : 'Iniciar y Registrar Lotes'}
                </Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Confirmar inicio de recepción
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        ¿Estás seguro de que quieres comenzar el proceso de recepción y registrar lotes?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button onClick={handleClose} sx={{ mr: 1 }}>Cancelar</Button>
                        <Button onClick={handleConfirm} variant="contained">Confirmar</Button>
                    </Box>
                    </Box>
                </Modal>
                </Box>
            </StyledPaper>
            </Grid>

            {/* Scan Products for Existing Reception Box */}
            <Grid item xs={12} md={6}>
            <StyledPaper elevation={6}>
                <Typography variant="h6" gutterBottom>
                    Escanear Productos para Recepción Existente
                </Typography>
                {receptionStarted ? (
                    <Box mt={2} width="100%">
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<QrCodeScannerIcon />}
                            onClick={() => navigate('/store-reception-batch')}
                            fullWidth
                        >
                            Almacenar Lotes
                        </Button>
                        <Typography variant="body2" color="textSecondary" mt={2}>
                            {/* ID de Recepción: {receptionMaster.receptionMasterId} */}
                        </Typography>
                    </Box>
                ) : (
                    <Typography variant="body2" mt={2}>
                        Inicie una recepción para activar el escaneo.
                    </Typography>
                )}
            </StyledPaper>
        </Grid>
        </>
        )}
        </Grid>
        </StyledContainer>
    );
    };

export default ReceptionPage;
