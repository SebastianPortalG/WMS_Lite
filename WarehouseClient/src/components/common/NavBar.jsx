// NavBar.js
import React from 'react';
import { AppBar, Toolbar, Button, Typography, styled, IconButton } from '@mui/material';
import {makeStyles} from '@mui/styles';
import { useUser } from '../UserContext';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const StyledAppBar = styled(AppBar)({
    flexGrow: 1,
  });
  
  const Title = styled(Typography)(({ theme }) => ({
    flexGrow: 1,
  }));
  
  const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    color: theme.palette.common.white,
    textDecoration: 'none',
  }));
const NavBar = () => {
  const { role, username, logout } = useUser();
  const navigate = useNavigate();

  if (role === 'guest') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }} component={RouterLink} to="/dashboard">
          WMS Lite
        </Typography>
        {role === 'ADMIN' && (
              <>
                <StyledButton color="inherit" component={RouterLink} to="/products/0/10">
                  Productos
                </StyledButton>
                <StyledButton color="inherit" component={RouterLink} to="/locations/0/10">
                  Ubicaciones
                </StyledButton>
              </>
            )}
        {role === 'ALMACENERO' && (
          <>
            <StyledButton color="inherit" component={RouterLink} to="/reception">
              Recepcion
            </StyledButton>
            <StyledButton color="inherit" component={RouterLink} to="/storage">
              Almacenamiento
            </StyledButton>
            <StyledButton color="inherit" component={RouterLink} to="/dispatch">
              Despacho
            </StyledButton>
            <StyledButton color="inherit" component={RouterLink} to="/inventory">
              Inventario
            </StyledButton>
          </>
        )}
        <IconButton color="inherit" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
