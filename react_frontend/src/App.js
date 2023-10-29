import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import ProfileComponent from './components/ProfileComponent';
import ListOfficerComponent from './components/ListOfficerComponent'; 
import CreateOfficerComponent from './components/CreateOfficerComponent'; 
import UpdateOfficerComponent from './components/UpdateOfficerComponent'; 
import ListBusinessPartsComponent from './components/ListBusinessPartsComponent'; 
import CreateDepartmentComponent from './components/CreateDepartmentComponent';
import UpdateDepartmentComponent from './components/UpdateDepartmentComponent';

// Import Material-UI components and styles
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// Import HeaderComponent
import HeaderComponent from './components/HeaderComponent';
import ViewBusinessPartsComponent from './components/ViewBusinessPartsComponent';
import ViewOfficerComponent from './components/ViewOfficerComponent';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check login status when the app loads
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/auth/AuthService', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('user')?.accessToken || ''}`
          },
        });

        if (response.status === 200) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="h6"><HeaderComponent /></Typography>
            </Link>
            <div style={{ marginLeft: 'auto' }}>
              {loggedIn && ( // Only show the menu when logged in
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <Link
                      to="/officers"
                      className="nav-link"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      Employees
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/businessParts"
                      className="nav-link"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      Departments
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </Toolbar>
        </AppBar>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<LoginComponent setLoggedIn={setLoggedIn} />} />
            <Route
              path="/app"
              element={
                loggedIn ? (
                  <>
                    <Route path="/profile" element={<ProfileComponent />} />
                    <Route path="/officers" element={<ListOfficerComponent />} />
                    <Route path="/add-officers" element={<CreateOfficerComponent />} />
                    <Route path="/edit-officers/:id" element={<UpdateOfficerComponent />} />
                    <Route path="/businessParts" element={<ListBusinessPartsComponent />} />
                    <Route path="/add-businessParts" element={<CreateDepartmentComponent />} />
                    <Route path="/edit-businessParts/:id" element={<UpdateDepartmentComponent />} />

                    <Route path="/view-businessParts/:id" element={<ViewBusinessPartsComponent />} />
                    <Route path="/view-officers/:id" element={<ViewOfficerComponent />} />
                  </>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;