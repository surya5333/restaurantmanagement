import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import api from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({ name: '', email: '', phone: '', visits: '', last_visit: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.getCustomers();
      console.log('Fetched customers:', response.data);
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Handle specific error cases
      if (error.response?.status === 500) {
        alert('Server error occurred while fetching customers. Please try again later.');
      } else {
        alert('Failed to fetch customers. Please check your connection and try again.');
      }
    }
  };

  const handleOpen = (customer = null) => {
    if (customer) {
      setCurrentCustomer(customer);
      setIsEditing(true);
    } else {
      setCurrentCustomer({ name: '', email: '', phone: '', visits: '', last_visit: ''});
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCustomer({ ...currentCustomer, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (!currentCustomer.name || !currentCustomer.email) {
        alert('Name and email are required fields.');
        return;
      }

      if (isEditing) {
        const response = await api.updateCustomer(currentCustomer.id, currentCustomer);
        console.log('Updated customer:', response.data);
      } else {
        const response = await api.addCustomer(currentCustomer);
        console.log('Added customer:', response.data);
      }
      await fetchCustomers();
      handleClose();
    } catch (error) {
      console.error('Error saving customer:', error);
      if (error.response?.status === 409) {
        alert('A customer with this email already exists.');
      } else if (error.response?.status === 400) {
        alert('Please fill in all required fields.');
      } else {
        alert('Failed to save customer. Please try again.');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteCustomer(id);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Customers</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Customer
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search color="action" sx={{ mr: 1 }} />
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell align="right">Total Visits</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell align="right">{customer.visits}</TableCell>
                <TableCell>{customer.last_visit}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(customer)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(customer.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={currentCustomer.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={currentCustomer.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            value={currentCustomer.phone}
            onChange={handleChange}
          />
         
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;