import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Typography, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useUser } from '../UserContext';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const NavBar = () => {
  const { role, logout } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!role || role === 'guest') {
    // Ensures NavBar is not rendered for 'guest' or undefined roles
    return null;
  }


  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {role === 'ADMIN' && (
        <>
          <MenuItem component={RouterLink} to="/products/0/10">Productos</MenuItem>
          <MenuItem component={RouterLink} to="/locations/0/10">Ubicaciones</MenuItem>
        </>
      )}
      {role === 'ALMACENERO' && (
        <>
          <MenuItem component={RouterLink} to="/reception">Recepcion</MenuItem>
          <MenuItem component={RouterLink} to="/storage">Almacenamiento</MenuItem>
          <MenuItem component={RouterLink} to="/dispatch">Despacho</MenuItem>
          <MenuItem component={RouterLink} to="/inventory">Inventario</MenuItem>
        </>
      )}
    </Menu>
  );
  

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/dashboard" sx={{ flexGrow: 1 }}>
          WMS Lite
        </Typography>
        {isMobile ? (
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <>
            {role === 'ADMIN' && (
              <>
                <Button color="inherit" component={RouterLink} to="/products/0/10">Productos</Button>
                <Button color="inherit" component={RouterLink} to="/locations/0/10">Ubicaciones</Button>
              </>
            )}
            {role === 'ALMACENERO' && (
              <>
                <Button color="inherit" component={RouterLink} to="/reception">Recepcion</Button>
                <Button color="inherit" component={RouterLink} to="/storage">Almacenamiento</Button>
                <Button color="inherit" component={RouterLink} to="/dispatch">Despacho</Button>
                <Button color="inherit" component={RouterLink} to="/inventory">Inventario</Button>
              </>
            )}
          </>
        )}
        <IconButton color="inherit" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
      {renderMobileMenu}
    </AppBar>
  );
};

export default NavBar;
