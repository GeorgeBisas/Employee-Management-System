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

function CreateDepartmentComponent(props) {
  const { id, Name: initialName } = props.match.params;

  const [Name, setName] = useState(initialName || '');
  const [isNameValid, setIsNameValid] = useState(true); // To track name validity

  useEffect(() => {
    if (id !== '_add') {
      MiniAppService.getBusinessPartsById(id)
        .then((res) => {
          const businessPart = res.data;
          setName(businessPart.Name);
        })
        .catch((error) => {
          console.error('Error loading department:', error);
        });
    }
  }, [id]);

  const checkDepartmentName = (name) => {
    MiniAppService.checkDepartmentNameExists(name)
      .then((res) => {
        // If a department with the same name exists, setIsNameValid to false
        setIsNameValid(!res.data);
      })
      .catch((error) => {
        console.error('Error checking department name:', error);
      });
  };

  const saveOrUpdateBusinessPart = (e) => {
    e.preventDefault();

    // Check if the name is valid (not already used)
    checkDepartmentName(Name);

    if (!isNameValid) {
      // Display an error message or handle as needed
      return;
    }

    const department = { Name };

    if (id === '_add') {
      MiniAppService.createBusinessParts(department)
        .then(() => {
          props.history.push('/business_parts');
        })
        .catch((error) => {
          console.error('Error creating department:', error);
        });
    } else {
      MiniAppService.updateBusinessParts(department, id)
        .then(() => {
          props.history.push('/business_parts');
        })
        .catch((error) => {
          console.error('Error updating department:', error);
        });
    }
  };

  const changeNameHandler = (event) => {
    const newName = event.target.value;
    setName(newName);
    // Check department name validity as the user types
    checkDepartmentName(newName);
  };

  const cancel = () => {
    props.history.push('/business_parts');
  };

  const getTitle = () => {
    return id === '_add' ? (
      <Typography variant="h5" align="center">
        Add Department
      </Typography>
    ) : (
      <Typography variant="h5" align="center">
        Update Department
      </Typography>
    );
  };

  return (
    <Container>
      <br />
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardContent>
              {getTitle()}
              <form>
                <TextField
                  label="Name Of Department"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="Name"
                  value={Name}
                  onChange={changeNameHandler}
                  error={!isNameValid}
                  helperText={!isNameValid ? 'Department name already exists' : ''}
                />

                <Button
                  variant="contained"
                  color="success"
                  onClick={saveOrUpdateBusinessPart}
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CreateDepartmentComponent;
