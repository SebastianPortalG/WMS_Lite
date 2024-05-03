import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  container: {
    position: 'relative', 
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Centers children vertically in the container
    alignItems: 'center', // Centers children horizontally
    textAlign: 'center',
    background: '#f0f2f5',
    margin: 0, // Resets default margin
    padding: '20px', // Padding to prevent content from touching the edges
  },
  topRightButton: {
    position: 'absolute !important', // Fixed position relative to the viewport
    top: '20px', // Distance from the top edge of the viewport
    right: '20px', // Distance from the right edge of the viewport
    background: '#007bff',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '20px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    '&:hover': {
      background: '#0056b3',
    },
    zIndex: 1000, // Ensure the button is above other elements
  },
  title: {
    fontSize: '2.4em',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  text: {
    fontSize: '1.2em',
  }
});

function LandingPage() {
  const navigate = useNavigate();
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Button
        onClick={() => navigate('/login')}
        className={classes.topRightButton}
      >
        INICIAR SESION
      </Button>
      <Typography variant="h2" className={classes.title}>
        WMS Lite le da la bienvenida
      </Typography>
      <Typography variant="subtitle1" className={classes.text}>
        ¡Emocionado por embarcar la aventura del almacén!
      </Typography>
    </Box>
  );
}

export default LandingPage;
