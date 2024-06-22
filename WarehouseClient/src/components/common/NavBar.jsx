import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Button, Typography, IconButton, Badge, Popover, List, ListItem, ListItemText, useMediaQuery, useTheme, Box, Drawer, ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useUser } from '../UserContext';
import ApiService from '../../service/ApiService';

const NavBar = () => {
  const { role, logout, userId } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (role === 'ADMIN') {
      const fetchNotifications = async () => {
        const { data, error } = await ApiService.fetchNotifications();
        if (data) {
          setNotifications(data);
          setUnreadCount(data.filter(notification => !notification.isRead).length);
        } else {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 60000); // Poll every 60 seconds

      return () => clearInterval(intervalId);
    }
  }, [role]);

  const handleMobileMenuClose = () => {
    setDrawerOpen(false);
  };

  const handleMobileMenuOpen = () => {
    setDrawerOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markAsRead = async (notificationId) => {
    const { data, error } = await ApiService.markNotificationAsRead(notificationId);
    if (data || !error) {
      setNotifications(notifications.map(notification =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      ));
      setUnreadCount(unreadCount - 1);
    } else {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  if (!role || role === 'guest') {
    return null;
  }

  const menuItems = [
    { text: 'Productos', to: '/products/0/10', visible: role === 'ADMIN' },
    { text: 'Ubicaciones', to: '/locations/0/10', visible: role === 'ADMIN' },
    { text: 'Inventario', to: '/inventory-comparison', visible: role === 'ADMIN' },
    { text: 'Ajuste', to: '/adjustment', visible: role === 'ADMIN' },
    { text: 'Existencias', to: '/storage-list/0/25', visible: role === 'ADMIN' },
    { text: 'Kardex', to: '/kardex/general', visible: role === 'ADMIN' },
    { text: 'Recepcion', to: '/reception', visible: role === 'ALMACENERO' },
    { text: 'Movimiento', to: '/storage', visible: role === 'ALMACENERO' },
    { text: 'Despacho', to: '/dispatch', visible: role === 'ALMACENERO' },
    { text: 'Inventario', to: '/inventory', visible: role === 'ALMACENERO' },
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/dashboard" sx={{ flexGrow: 1 }}>
            WMS Lite
          </Typography>
          {isMobile ? (
            <IconButton
              edge="end"
              aria-label="menu"
              aria-controls="primary-search-account-menu-mobile"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              {menuItems.map(item => item.visible && (
                <Button key={item.text} color="inherit" component={RouterLink} to={item.to}>
                  {item.text}
                </Button>
              ))}
              {role === 'ADMIN' && (
                <IconButton
                  aria-label="show new notifications"
                  color="inherit"
                  onClick={handleNotificationClick}
                >
                  <Badge badgeContent={unreadCount} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              )}
            </>
          )}
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={{ minWidth: 300, minHeight: 100 }}>
            {notifications.length === 0 ? (
              <Typography variant="body1" align="center" sx={{ p: 2 }}>
                Sin notificaciones
              </Typography>
            ) : (
              <List>
                {notifications.map((notification) => (
                  <ListItem key={notification.id} button onClick={() => markAsRead(notification.id)}>
                    <ListItemText primary={notification.message} secondary={notification.isRead ? 'Read' : 'Unread'} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Popover>
      </AppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleMobileMenuClose}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleMobileMenuClose}
          onKeyDown={handleMobileMenuClose}
        >
          <List>
            {menuItems.map(item => item.visible && (
              <ListItem button key={item.text} component={RouterLink} to={item.to}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;
