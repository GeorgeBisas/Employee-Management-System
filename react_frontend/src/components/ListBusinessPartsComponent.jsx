import React, { useState, useEffect } from 'react';
import MiniAppService from '../services/MiniAppService';
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import UpdateDepartmentComponent from './UpdateDepartmentComponent';
import ViewBusinessPartsComponent from './ViewBusinessPartsComponent';

function ListBusinessPartsComponent() {
  const [businessParts, setBusinessParts] = useState([]);
  const [employees, setOfficers] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDuplicateMessageOpen, setIsDuplicateMessageOpen] = useState(false);
  const [isCreateOfficerDialogOpen, setIsCreateOfficerDialogOpen] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    firstName: '',
    lastName: '',
    afm: '',
    dateOfBirth: '',
  });
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [currentBusinessPartId, setCurrentBusinessPartId] = useState(null);
  const [editedOfficer, setEditedOfficer] = useState(null); // State to manage the edited officer
  const navigate = useNavigate();

  const openUpdateDialog = (businessPart) => {
    setCurrentBusinessPartId(businessPart);
    setIsUpdateDialogOpen(true);
  };

  const closeUpdateDialog = () => {
    setCurrentBusinessPartId(null);
    setIsUpdateDialogOpen(false);
  };

  const deleteBusinessParts = (id) => {
    MiniAppService.deleteBusinessPart(id)
      .then(() => {
        setBusinessParts((prevBusinessParts) => {
          return prevBusinessParts.filter((businessPart) => businessPart.id !== id);
        });
      })
      .catch((error) => {
        console.error('Error deleting business part:', error);
      });
  };

  const handleAddDialogOpen = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setNewDepartmentName('');
  };

  const openCreateOfficerDialog = (businessPartId) => {
    setIsCreateOfficerDialogOpen(true);
    setCurrentBusinessPartId(businessPartId);
  };

  const closeCreateOfficerDialog = () => {
    setIsCreateOfficerDialogOpen(false);
    setCurrentBusinessPartId(null);
    setNewOfficer({
      firstName: '',
      lastName: '',
      afm: '',
      dateOfBirth: '',
    });
  };

  const closeEditOfficerDialog = () => {
    // Clear the edited officer data from the state
    setEditedOfficer(null);
  };

  const handleDuplicateMessageClose = () => {
    setIsDuplicateMessageOpen(false);
  };

  const addBusinessParts = () => {
    handleAddDialogOpen();
  };

  const saveBusinessPart = () => {
    // Check if the department name is empty
    if (newDepartmentName.trim() === '') {
      alert('Department name cannot be empty.');
      return;
    }

    // Check if the department name is a duplicate
    const duplicateName = businessParts.some(
      (businessPart) => businessPart.name === newDepartmentName
    );

    if (!duplicateName) {
      // If not a duplicate, create the department
      const newDepartment = { Name: newDepartmentName };
      MiniAppService.createBusinessPart(newDepartment)
        .then(() => {
          handleAddDialogClose(); // Close the dialog
          refreshBusinessParts(); // Refresh the list of departments
        })
        .catch((error) => {
          console.error('Error creating department:', error);
        });
    } else {
      // Display a duplicate message
      setIsDuplicateMessageOpen(true);
    }
  };

  const viewOfficers = (businessPartId) => {
    const employeesForBusinessPart = employees[businessPartId];
    if (employeesForBusinessPart) {
      console.log('Officers for Business Part:', employeesForBusinessPart);
    } else {
      console.log('No officers found for this Business Part.');
    }
  };

  const saveOfficerInBusinessPart = () => {
    // Check if the officer data is valid
    if (
      newOfficer.firstName.trim() === '' ||
      newOfficer.lastName.trim() === '' ||
      newOfficer.afm.trim() === '' ||
      newOfficer.dateOfBirth.trim() === ''
    ) {
      alert('Please fill in all officer details.');
      return;
    }

    // Send a request to create the officer within the selected business department
    const businessPartId = currentBusinessPartId;
    const officerData = {
      firstName: newOfficer.firstName,
      lastName: newOfficer.lastName,
      afm: newOfficer.afm,
      dateOfBirth: newOfficer.dateOfBirth,
    };

    MiniAppService.createOfficerWithinBusinessPart(businessPartId, officerData)
      .then(() => {
        // Close the "Create Officer" dialog
        closeCreateOfficerDialog();
        // Refresh the list of officers for the current business department
        refreshOfficersForBusinessPart(businessPartId);
      })
      .catch((error) => {
        console.error('Error creating officer:', error);
      });
  };

  const refreshBusinessParts = () => {
    MiniAppService.getAllBusinessParts()
      .then((res) => {
        setBusinessParts(res.data);
      })
      .catch((error) => {
        console.error('Error fetching business parts:', error);
      });
  };

  const refreshOfficersForBusinessPart = (businessPartId) => {
    MiniAppService.getOfficersByBusinessPartId(businessPartId)
      .then((response) => {
        setOfficers((prevOfficers) => ({
          ...prevOfficers,
          [businessPartId]: response.data,
        }));
      })
      .catch((error) => {
        console.error('Error fetching officers:', error);
      });
  };

  useEffect(() => {
    const userLoggedIn = true;
    setLoggedIn(userLoggedIn);

    if (userLoggedIn) {
      // If the user is logged in
      refreshBusinessParts();

      businessParts.forEach((businessPart) => {
        MiniAppService.getOfficersByBusinessPartId(businessPart.id)
          .then((response) => {
            setOfficers((prevOfficers) => ({
              ...prevOfficers,
              [businessPart.id]: response.data,
            }));
          })
          .catch((error) => {
            console.error('Error fetching officers:', error);
          });
      });
    } else {
      navigate('/login');
    }
  }, [navigate, businessParts]);

  const deleteOfficerInBusinessPart = (businessPartId, officerId) => {
    MiniAppService.deleteOfficer(officerId)
      .then(() => {
        // Refresh the list of officers for the current business department
        refreshOfficersForBusinessPart(businessPartId);
      })
      .catch((error) => {
        console.error('Error deleting officer:', error);
      });
  };

  const updateOfficerInBusinessPart = (businessPartId, officerId) => {
    // Find the officer to edit
    const officerToEdit = employees[businessPartId].find(
      (officer) => officer.id === officerId
    );

    if (officerToEdit) {
      // Set the officer to be edited in the state
      setEditedOfficer(officerToEdit);
    }
  };

  const saveEditedOfficer = () => {
    // Implement the logic to save the edited officer's details here
    // Send a request to update the officer's details
    const updatedOfficerData = {
      // Update officer's details with edited values
      id: editedOfficer.id,
      firstName: editedOfficer.firstName,
      lastName: editedOfficer.lastName,
      afm: editedOfficer.afm,
      dateOfBirth: editedOfficer.dateOfBirth,
    };

    MiniAppService.updateOfficer(updatedOfficerData)
      .then(() => {
        // Close the edit dialog
        closeEditOfficerDialog();
        // Refresh the list of officers for the current business department
        refreshOfficersForBusinessPart(currentBusinessPartId);
      })
      .catch((error) => {
        console.error('Error updating officer:', error);
      });
  };

  return (
    <div>
      <Typography variant="h4" align="center">
        Business Departments List
      </Typography>

      {loggedIn && (
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={addBusinessParts}
            >
              Add Business Department
            </Button>
          </Grid>
        </Grid>
      )}


      {businessParts.map((businessPart) => (
        <ViewBusinessPartsComponent businessPart={businessPart} key={businessPart.id} />
      ))}  

      <Dialog open={isAddDialogOpen} onClose={handleAddDialogClose}>
        <DialogTitle>Add Department</DialogTitle>
        <DialogContent>
          <TextField
            label="Department Name"
            variant="outlined"
            value={newDepartmentName}
            onChange={(e) => setNewDepartmentName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={saveBusinessPart}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDuplicateMessageOpen} onClose={handleDuplicateMessageClose}>
        <DialogTitle>Department Already Exists</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            The department name already exists. Please choose a different name.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDuplicateMessageClose}>OK</Button>
        </DialogActions>
      </Dialog>

        <Dialog open={isUpdateDialogOpen} onClose={closeUpdateDialog}>
        <DialogTitle>Update Business Department</DialogTitle>
        <DialogContent>
          {currentBusinessPartId && (
            <UpdateDepartmentComponent businessPart={currentBusinessPartId} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdateDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateOfficerDialogOpen} onClose={closeCreateOfficerDialog}>
        <DialogTitle>Create Officer in Business Department</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            variant="outlined"
            value={newOfficer.firstName}
            onChange={(e) =>
              setNewOfficer({ ...newOfficer, firstName: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            variant="outlined"
            value={newOfficer.lastName}
            onChange={(e) =>
              setNewOfficer({ ...newOfficer, lastName: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="AFM"
            variant="outlined"
            value={newOfficer.afm}
            onChange={(e) => setNewOfficer({ ...newOfficer, afm: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date of Birth"
            variant="outlined"
            value={newOfficer.dateOfBirth}
            onChange={(e) =>
              setNewOfficer({ ...newOfficer, dateOfBirth: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateOfficerDialog}>Cancel</Button>
          <Button onClick={saveOfficerInBusinessPart}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editedOfficer} onClose={closeEditOfficerDialog}>
        <DialogTitle>Edit Officer</DialogTitle>
        <DialogContent>
          {editedOfficer && (
            <div>
              <TextField
                label="First Name"
                variant="outlined"
                value={editedOfficer.firstName}
                onChange={(e) =>
                  setEditedOfficer({
                    ...editedOfficer,
                    firstName: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                variant="outlined"
                value={editedOfficer.lastName}
                onChange={(e) =>
                  setEditedOfficer({
                    ...editedOfficer,
                    lastName: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="AFM"
                variant="outlined"
                value={editedOfficer.afm}
                onChange={(e) =>
                  setEditedOfficer({ ...editedOfficer, afm: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Date of Birth"
                variant="outlined"
                value={editedOfficer.dateOfBirth}
                onChange={(e) =>
                  setEditedOfficer({
                    ...editedOfficer,
                    dateOfBirth: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditOfficerDialog}>Cancel</Button>
          <Button onClick={saveEditedOfficer}>Save</Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Business Departments</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {businessParts.map((businessPart) => (
              <TableRow key={businessPart.id}>
                <TableCell>{businessPart.name}</TableCell>
                <TableCell>
                <Button
                    variant="contained"
                    color="info"
                    onClick={() => openUpdateDialog(businessPart)}
                    style={{ marginRight: 8 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteBusinessParts(businessPart.id)}
                    style={{ marginRight: 8 }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => viewOfficers(businessPart.id)}
                  >
                    View Officers
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => openCreateOfficerDialog(businessPart.id)}
                  >

                    Create Officer
                  </Button>
                  {/* Add an "Update Officer" button for each officer */}
                  {employees[businessPart.id] &&
                    employees[businessPart.id].map((officer) => (
                      <div key={officer.id}>
                        {officer.firstName} {officer.lastName} {officer.afm}
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() =>
                            deleteOfficerInBusinessPart(
                              businessPart.id,
                              officer.id
                            )
                          }
                        >
                          Delete Officer
                        </Button>
                        <Button
                          variant="contained"
                          color="info"
                          onClick={() =>
                            updateOfficerInBusinessPart(
                              businessPart.id,
                              officer.id
                            )
                          }
                        >
                          Update Officer
                        </Button>
                      </div>
                    ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ListBusinessPartsComponent;