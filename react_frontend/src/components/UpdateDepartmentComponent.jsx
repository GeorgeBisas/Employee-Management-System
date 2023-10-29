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

function UpdateDepartmentComponent(props) {
  const { id } = props.match.params;

  const [department, setDepartment] = useState({ Name: '' });
  const [isNameUnique, setIsNameUnique] = useState(true); // To track name uniqueness
  const [errorMessage, setErrorMessage] = useState(''); // Error message state

  useEffect(() => {
    MiniAppService.getBusinessPartById(id)
      .then((res) => {
        const retrievedDepartment = res.data;
        setDepartment(retrievedDepartment);
      })
      .catch((error) => {
        console.error('Error loading department:', error);
      });
  }, [id]);

  useEffect(() => {
    // Check name uniqueness when the department name changes
    MiniAppService.checkDepartmentNameExists(department.Name)
      .then((res) => {
        setIsNameUnique(!res.data);
      })
      .catch((error) => {
        console.error('Error checking department name uniqueness:', error);
      });
  }, [department.Name]);

  const updateDepartment = (e) => {
    e.preventDefault();

    // Check if the department name is not unique
    if (!isNameUnique) {
      setErrorMessage('Department name is not unique. Please choose a different name.');
      return;
    }

    MiniAppService.updateBusinessPart(department, id)
      .then(() => {
        props.history.push('/business_parts');
      })
      .catch((error) => {
        console.error('Error updating department:', error);
      });
  };

  const changeNameHandler = (event) => {
    setDepartment({ ...department, Name: event.target.value });
  };

  const cancel = () => {
    props.history.push('/business_parts');
  };

  return (
    <Container>
      <br />
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" align="center">
                Update Department
              </Typography>
              <form>
                <TextField
                  label="Name Of Department"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="Name"
                  value={department.Name}
                  onChange={changeNameHandler}
                  error={!isNameUnique}
                  helperText={!isNameUnique ? 'Department name is not unique' : ''}
                />

                <Button
                  variant="contained"
                  color="success"
                  onClick={updateDepartment}
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

export default UpdateDepartmentComponent;
