import React from 'react';
import { useDispatch } from "react-redux";
import { Button, Container, Grid, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ACTIONS } from '../../Reducers/UserReducer';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    dispatch({ 
      type: ACTIONS.GET_USER, 
      callback: () => {
        navigate('/orgNTenant', { replace: true });
      } 
    });
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Grid container spacing={4} alignItems="center" justifyContent="center" direction="column">
          {/* RPA Portal Title */}
          <Typography 
            variant="h5" 
            gutterBottom 
            style={{ color: '#4CAF50', fontWeight: 'bold', textAlign: 'center' }} // 綠色字體
          >
            RPA Portal
          </Typography>

          {/* Login Box */}
          <Box 
            sx={{
              backgroundColor: '#ffffff', // 白色背景
              padding: '32px',
              borderRadius: '8px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // 陰影效果
              textAlign: 'center',
              width:'444px !important', 
              margin: "0 auto",
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              style={{ fontWeight: 'bold' }}
            >
              LOG IN WITH
            </Typography>
            <Typography 
              variant="body2" 
              color="textSecondary" 
              style={{ marginBottom: '16px' }}
            >
              Login Delta AD Account with SSO
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleLogin}
              style={{ width: '100%' }}
            >
              SINGLE SIGN-ON (SSO)
            </Button>
          </Box>
        </Grid>
      </Container>
    </div>
  );
};

export default Login;
