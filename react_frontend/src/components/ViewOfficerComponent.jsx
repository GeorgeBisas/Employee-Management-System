import React, { useState, useEffect } from 'react';
import MiniAppService from '../services/MiniAppService';
import {
  Container,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

function ViewOfficerComponent(props) {
  const [id] = useState(props.match.params.id);
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    MiniAppService.getEmployeeById(id).then((res) => {
      setEmployee(res.data);
    });
  }, [id]);

  return (
    <Container>
      <br />
      <Card>
        <CardContent>
          <Typography variant="h5" align="center">
            View Employee Details
          </Typography>
          <div className="row">
            <Typography variant="h6">Employee First Name:</Typography>
            <Typography variant="body1">{employee.firstName}</Typography>
          </div>
          <div className="row">
            <Typography variant="h6">Employee Last Name:</Typography>
            <Typography variant="body1">{employee.lastName}</Typography>
          </div>
          <div className="row">
            <Typography variant="h6">Employee AFM:</Typography>
            <Typography variant="body1">{employee.afm}</Typography>
          </div>
          <div className="row">
            <Typography variant="h6">Employee Date Of Birthday:</Typography>
            <Typography variant="body1">{employee.dateOfBirth}</Typography>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ViewOfficerComponent;
