import React, { useState, useEffect } from 'react';
import MiniAppService from '../services/MiniAppService';
import {
  Button,
  TextField,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

function UpdateOfficerComponent(props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [afm, setAfm] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isAfmUnique, setIsAfmUnique] = useState(true); // To track AFM uniqueness
  const [isNameUnique, setIsNameUnique] = useState(true); // To track name uniqueness
  const [errorMessage, setErrorMessage] = useState(''); // Error message state

  const id = props.match.params.id;

  useEffect(() => {
    MiniAppService.getOfficerById(id)
      .then((res) => {
        const officer = res.data;
        setFirstName(officer.firstName);
        setLastName(officer.lastName);
        setAfm(officer.afm);
        setDateOfBirth(officer.dateOfBirth);
      })
      .catch((error) => {
        console.error('Error fetching officer data: ', error);
      });
  }, [id]);

  useEffect(() => {
    // Check AFM uniqueness when AFM changes
    MiniAppService.checkAfmUniqueness(afm)
      .then((res) => {
        setIsAfmUnique(res.data);
      })
      .catch((error) => {
        console.error('Error checking AFM uniqueness: ', error);
      });

    // Check name uniqueness when first name and last name change
    MiniAppService.checkNameUniqueness(firstName, lastName)
      .then((res) => {
        setIsNameUnique(res.data);
      })
      .catch((error) => {
        console.error('Error checking name uniqueness: ', error);
      });
  }, [afm, firstName, lastName]);

  const updateOfficer = (e) => {
    e.preventDefault();

    // Check if AFM or name is not unique
    if (!isAfmUnique || !isNameUnique) {
      setErrorMessage('AFM or Name is not unique. Please fix the errors before updating.');
      return;
    }

    const updatedOfficer = {
      firstName,
      lastName,
      afm,
      dateOfBirth,
    };

    MiniAppService.updateOfficer(updatedOfficer, id)
      .then(() => {
        props.history.push('/officers');
      })
      .catch((error) => {
        console.error('Error updating officer: ', error);
      });
  };

  const cancel = () => {
    props.history.push('/officers');
  };

  return (
    <Container>
      <br />
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" align="center">
                Update Officer
              </Typography>
              <form>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={!isNameUnique}
                  helperText={!isNameUnique ? 'Name is not unique' : ''}
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={!isNameUnique}
                  helperText={!isNameUnique ? 'Name is not unique' : ''}
                />
                <TextField
                  label="AFM"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="afm"
                  value={afm}
                  onChange={(e) => setAfm(e.target.value)}
                  error={!isAfmUnique}
                  helperText={!isAfmUnique ? 'AFM is not unique' : ''}
                />
                <TextField
                  label="Date of Birth"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />

                <Button
                  variant="contained"
                  color="success"
                  onClick={updateOfficer}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={cancel}
                  style={{ marginLeft: '10px' }}
                >
                  Cancel
                </Button>
              </form>
              {errorMessage && (
                <Typography variant="body2" color="error">
                  {errorMessage}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default UpdateOfficerComponent;
