import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import AuthService from '../services/AuthService';

function Profile() {
  const currentUser = AuthService.getCurrentUser();

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '16px' }}>
        <Typography variant="h5" gutterBottom>
          <strong>{currentUser.username}</strong> Profile
        </Typography>
        <Typography variant="body1">
          <strong>Id:</strong> {currentUser.id}
        </Typography>
        <Typography variant="body1">
          <strong>Username:</strong> {currentUser.login}
        </Typography>
      </Paper>
    </Container>
  );
}

export default Profile;
