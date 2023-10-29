import React, { useState, useEffect } from 'react';
import MiniAppService from '../services/MiniAppService';
import {
  Container,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

function ViewBusinessPartsComponent(props) {
  const [id] = useState(props.match.params.id);
  const [businessParts, setBusinessParts] = useState({});

  useEffect(() => {
    MiniAppService.getBusinessPartById(id).then((res) => {
      setBusinessParts(res.data);
    });
  }, [id]);

  return (
    <Container>
      <br />
      <Card>
        <CardContent>
          <Typography variant="h5" align="center">
            View Department Details
          </Typography>
          <div className="row">
            <Typography variant="h6">Department Name:</Typography>
            <Typography variant="body1">{businessParts.Name}</Typography>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ViewBusinessPartsComponent;
