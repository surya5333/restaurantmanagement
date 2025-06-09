import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Restaurant Manager
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/customers">Customers</Button>
          <Button color="inherit" component={Link} to="/menu">Menu</Button>
          <Button color="inherit" component={Link} to="/reservations">Reservations</Button>
          <Button color="inherit" component={Link} to="/reviews">Reviews</Button>
          <Button color="inherit" component={Link} to="/payments">Payments</Button>
          <Button color="inherit" component={Link} to="/delivery">Delivery</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;