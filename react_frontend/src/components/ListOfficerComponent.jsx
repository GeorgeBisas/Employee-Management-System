import React, { useState, useEffect } from 'react';
import MiniAppService from '../services/MiniAppService';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import CreateOfficerComponent from './CreateOfficerComponent';
import UpdateOfficerComponent from './UpdateOfficerComponent';
import ViewOfficerComponent from './ViewOfficerComponent';

function ListOfficerComponent() {
  const [officers, setOfficers] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    afm: '',
    firstName: '',
    lastName: '',
  });
  const [currentOfficer, setCurrentOfficer] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [allOfficers, setAllOfficers] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteOfficer, setDeleteOfficer] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [searchSuccessful, setSearchSuccessful] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = true;
    setLoggedIn(loggedIn);
    if (loggedIn) {
      MiniAppService.getAllOfficers()
        .then((res) => {
          setOfficers(res.data);
          setAllOfficers(res.data);
        })
        .catch((error) => {
          console.error('Error fetching officers: ', error);
        });
    } else {
      console.error('User is not logged in.');
      navigate('/login');
    }
  }, [navigate]);

  const searchByCriteria = () => {
    const afmSearch = searchCriteria.afm.trim();
    const firstNameSearch = searchCriteria.firstName.trim();
    const lastNameSearch = searchCriteria.lastName.trim();

    if (!afmSearch && !firstNameSearch && !lastNameSearch) {
      setOfficers(allOfficers);
      setSearchSuccessful(true);
      return;
    }

    const filteredOfficers = allOfficers.filter((officer) => {
      const matchesAfm = !afmSearch || officer.afm.includes(afmSearch);
      const matchesFirstName = !firstNameSearch || officer.firstName.includes(firstNameSearch);
      const matchesLastName = !lastNameSearch || officer.lastName.includes(lastNameSearch);

      return matchesAfm && matchesFirstName && matchesLastName;
    });

    if (filteredOfficers.length === 0) {
      alert('No officers matching the search criteria were found.');
      setSearchSuccessful(false);
      setOfficers([]);
      if (allOfficers.length === 0) {
        setIsCreating(true);
      }
    } else {
      setSearchSuccessful(true);
    }

    setOfficers(filteredOfficers);
  };

  const onChangeSearchCriteria = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };

  const setActiveOfficer = (officer, index) => {
    setCurrentOfficer(officer);
    setCurrentIndex(index);

    MiniAppService.getOfficerById(officer.id)
      .then((response) => {
        setEmployeeData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching employee data:', error);
      });
  };

  const clearActiveOfficer = () => {
    setCurrentOfficer(null);
    setCurrentIndex(-1);
    setEmployeeData([]);
  };

  const handleDeleteClick = (officer) => {
    setDeleteOfficer(officer);
    setIsDeleting(true);
  };

  const handleCreateClick = () => {
    setIsCreating(true);
  };

  const handleUpdateClick = () => {
    setIsUpdating(true);
  };

  const handleViewClick = () => {
    setIsViewing(true);
  };

  const handleDeleteOfficer = () => {
    if (deleteOfficer) {
      MiniAppService.deleteOfficer(deleteOfficer.id)
        .then(() => {
          setOfficers((prevOfficers) => prevOfficers.filter((o) => o.id !== deleteOfficer.id));
          setIsDeleting(false);
          setDeleteOfficer(null);
          clearActiveOfficer();
        })
        .catch((error) => {
          console.error('Error deleting officer:', error);
        });
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleting(false);
    setDeleteOfficer(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Typography variant="h5" gutterBottom>
            Employees List
          </Typography>
          <TextField
            type="text"
            label="Search by AFM"
            name="afm"
            value={searchCriteria.afm}
            onChange={onChangeSearchCriteria}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            type="text"
            label="Search by First Name"
            name="firstName"
            value={searchCriteria.firstName}
            onChange={onChangeSearchCriteria}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            type="text"
            label="Search by Last Name"
            name="lastName"
            value={searchCriteria.lastName}
            onChange={onChangeSearchCriteria}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={searchByCriteria}
            fullWidth
          >
            Search
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <List>
          {officers.map((officer, index) => (
            <ListItem
              key={index}
              button
              selected={index === currentIndex}
              onClick={() => setActiveOfficer(officer, index)}
            >
              <ListItemAvatar>
                <Avatar>{`${officer.firstName[0]}${officer.lastName[0]}`}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${officer.firstName} ${officer.lastName}`}
                secondary={`AFM: ${officer.afm}`}
              />
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteClick(officer)}
                style={{ marginLeft: '16px' }}
              >
                Delete
              </Button>
            </ListItem>
          ))}
          {searchSuccessful && loggedIn && (
            <ListItem>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateClick}
                fullWidth
              >
                Create Employee
              </Button>
            </ListItem>
          )}
        </List>
      </Grid>
      <Grid item xs={12} sm={6}>
        {currentOfficer ? (
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h5" gutterBottom>
              Officer
            </Typography>
            <Typography variant="body1">
              <strong>First Name:</strong> {currentOfficer.firstName}
            </Typography>
            <Typography variant="body1">
              <strong>Last Name:</strong> {currentOfficer.lastName}
            </Typography>
            <Typography variant="body1">
              <strong>AFM:</strong> {currentOfficer.afm}
            </Typography>
            <Typography variant="body1">
              <strong>Date of Birth:</strong> {formatDate(currentOfficer.dateOfBirth)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateClick}
              style={{ marginTop: '16px' }}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleViewClick}
              style={{ marginTop: '16px', marginLeft: '16px' }}
            >
              View
            </Button>
          </Paper>
        ) : (
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="body1">
              Employee details...
            </Typography>
          </Paper>
        )}
      </Grid>
      <Grid item xs={12}>
        {currentOfficer && employeeData.length > 0 && (
          <TableContainer component={Paper} style={{ marginTop: '16px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>AFM</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Date of Birth</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeData.map((employee) => (
                  <TableRow key={employee.afm}>
                    <TableCell>{employee.afm}</TableCell>
                    <TableCell>{employee.firstName}</TableCell>
                    <TableCell>{employee.lastName}</TableCell>
                    <TableCell>{formatDate(employee.dateOfBirth)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
      {isCreating && (
        <CreateOfficerComponent
          onCreateSuccess={() => {
            setIsCreating(false);
            MiniAppService.getAllOfficers()
              .then((res) => {
                setOfficers(res.data);
                setAllOfficers(res.data);
              })
              .catch((error) => {
                console.error('Error fetching officers: ', error);
              });
          }}
          onCancel={() => setIsCreating(false)}
        />
      )}
      {isUpdating && currentOfficer && (
        <UpdateOfficerComponent
          officer={currentOfficer}
          onUpdateSuccess={() => {
            setIsUpdating(false);
            MiniAppService.getAllOfficers()
              .then((res) => {
                setOfficers(res.data);
                setAllOfficers(res.data);
              })
              .catch((error) => {
                console.error('Error fetching officers: ', error);
              });
          }}
          onCancel={() => setIsUpdating(false)}
        />
      )}
      {isViewing && currentOfficer && (
        <ViewOfficerComponent
          officer={currentOfficer}
          onCancel={() => setIsViewing(false)}
        />
      )}
      <Dialog open={isDeleting} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this officer?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteOfficer} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default ListOfficerComponent;
