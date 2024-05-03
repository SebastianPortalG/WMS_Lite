import React from 'react';
import { useUser } from './UserContext';
import { Typography, Container, styled, Paper, Box } from '@mui/material';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
}));

const Header = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SubHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const DashboardPage = () => {
    const { role, username } = useUser();

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper elevation={6}>
        <Box p={3}>
          <Header variant="h4" component="h1">
            Inicio
          </Header>
          <SubHeader variant="subtitle1">
            ¡Bienvenido de vuelta, {username}! 
          </SubHeader>
          {/* Additional content and widgets can be added here */}
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
};

export default DashboardPage;
