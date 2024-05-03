import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../service/ApiService';
import { Button, TextField } from '@mui/material';
import { VpnKey as VpnKeyIcon, AccountCircle } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { makeStyles } from '@mui/styles';
import { useUser } from './UserContext';

const useStyles = makeStyles({
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f0f2f5',
  },
  signin: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '400px',
  },
  contentH2: {
    fontSize: '2.4em',
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  inputBox: {
    marginBottom: '20px',
  },
  textField: {
    borderRadius: '20px',
    boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  buttonRoot: {
    background: '#007bff',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      background: '#0056b3',
    },
  },
});

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const classes = useStyles();
  const {updateUserData} = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await ApiService.login({ username, password });
      if (error) throw new Error(error);
      updateUserData(data.role, username, data.accessToken);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={classes.loginContainer}>
      <div className={classes.signin}>
        <div className={classes.content}>
          <h2 className={classes.contentH2}>Inicio de Sesión</h2>
          <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.inputBox}>
              <TextField
                fullWidth
                label="Nombre de Usuario"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: <AccountCircle />,
                }}
                className={classes.textField}
              />
            </div>
            <div className={classes.inputBox}>
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: <VpnKeyIcon />,
                }}
                className={classes.textField}
              />
            </div>
            <div className={classes.inputBox}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                classes={{ root: classes.buttonRoot }}
              >
                Iniciar Sesión
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
