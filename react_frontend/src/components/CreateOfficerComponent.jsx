import React, { useState } from 'react';
import MiniAppService from '../services/MiniAppService';
import {
  Button,
  TextField,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Alert, // Added Alert component for displaying errors
} from '@mui/material';

function CreateOfficerComponent(props) {
  const [employeeData, setEmployeeData] = useState({
    afm: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });
  const [isAfmUnique, setIsAfmUnique] = useState(true); // To track AFM uniqueness
  const [isNameUnique, setIsNameUnique] = useState(true); // To track name uniqueness
  const [error, setError] = useState(null); // To store error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value,
    });
  };

  const checkUniqueness = () => {
    const { afm, firstName, lastName } = employeeData;

    // Send requests to your backend API to check uniqueness
    Promise.all([
      MiniAppService.checkAfmUniqueness(afm),
      MiniAppService.checkNameUniqueness(firstName, lastName),
    ])
      .then(([afmRes, nameRes]) => {
        setIsAfmUnique(afmRes.data);
        setIsNameUnique(nameRes.data);
      })
      .catch((error) => {
        console.error('Error checking uniqueness:', error);
      });
  };

  const saveOfficer = (e) => {
    e.preventDefault();
    const { afm, firstName, lastName, dateOfBirth } = employeeData;

    if (!isAfmUnique || !isNameUnique) {
      // Display an error message if AFM or name is not unique
      setError('AFM and/or Name is not unique. Please check and try again.');
      return;
    }

    const officer = { afm, firstName, lastName, dateOfBirth };

    MiniAppService.createOfficer(officer)
      .then(() => {
        // Employee created successfully
        
        props.history.push('/officers');
      })
      .catch((error) => {
        console.error('Error creating employee:', error);
      });
  };

  return (
    <Container>
      <br />
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" align="center">
                Create Employee
              </Typography>
              <form onSubmit={saveOfficer}>
                <TextField
                  label="AFM (Tax ID)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="afm"
                  value={employeeData.afm}
                  onChange={handleChange}
                  onBlur={checkUniqueness}
                  error={!isAfmUnique}
                  helperText={!isAfmUnique ? 'AFM is not unique' : ''}
                />
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="firstName"
                  value={employeeData.firstName}
                  onChange={handleChange}
                  onBlur={checkUniqueness}
                  error={!isNameUnique}
                  helperText={!isNameUnique ? 'Name is not unique' : ''}
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="lastName"
                  value={employeeData.lastName}
                  onChange={handleChange}
                  onBlur={checkUniqueness}
                  error={!isNameUnique}
                  helperText={!isNameUnique ? 'Name is not unique' : ''}
                />
                <TextField
                  type="date"
                  label="Date of Birth"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="dateOfBirth"
                  value={employeeData.dateOfBirth}
                  onChange={handleChange}
                />
                {error && (
                  <Alert severity="error" style={{ marginBottom: '10px' }}>
                    {error}
                  </Alert>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={saveOfficer} 
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => props.history.push('/officers')}
                  style={{ marginLeft: '10px' }}
                >
                  Cancel
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CreateOfficerComponent;
