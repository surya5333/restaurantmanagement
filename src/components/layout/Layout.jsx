import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Navbar />
      <Container 
        component="main" 
        maxWidth={false} 
        disableGutters 
        sx={{ flexGrow: 1, py: 3, px: 0 }}
      >
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;

