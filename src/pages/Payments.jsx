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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import api from '../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState({
    customer_id: '',
    amount: '',
    payment_date: new Date(),
    payment_method: '',
    status: 'Pending'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [customers, setCustomers] = useState([]);

  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];
  const statuses = ['Pending', 'Completed', 'Failed', 'Refunded'];

  useEffect(() => {
    fetchPayments();
    fetchCustomers();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.getPayments();
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleOpen = (payment = null) => {
    if (payment) {
      setCurrentPayment({
        ...payment,
        payment_date: new Date(payment.payment_date)
      });
      setIsEditing(true);
    } else {
      setCurrentPayment({
        customer_id: '',
        amount: '',
        payment_date: new Date(),
        payment_method: '',
        status: 'Pending'
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPayment({ ...currentPayment, [name]: value });
  };

  const handleDateChange = (date) => {
    setCurrentPayment({ ...currentPayment, payment_date: date });
  };

  const handleSave = async () => {
    try {
      const paymentData = {
        ...currentPayment,
        amount: parseFloat(currentPayment.amount),
        payment_date: currentPayment.payment_date.toISOString()
      };

      if (isEditing) {
        await api.updatePayment(currentPayment.id, paymentData);
      } else {
        await api.addPayment(paymentData);
      }
      fetchPayments();
      handleClose();
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deletePayment(id);
      fetchPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'warning',
      Completed: 'success',
      Failed: 'error',
      Refunded: 'info'
    };
    return colors[status] || 'default';
  };

  const filteredPayments = payments.filter(payment => {
    const customer = customers.find(c => c.id === payment.customer_id);
    const customerName = customer ? `${customer.first_name} ${customer.last_name}` : '';
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.payment_method.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || new Date(payment.payment_date).toDateString() === dateFilter.toDateString();
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Payments</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Payment
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Search by customer or payment method..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search color="action" sx={{ mr: 1 }} />
          }}
          sx={{ flexGrow: 1 }}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Filter by Date"
            value={dateFilter}
            onChange={setDateFilter}
            renderInput={(params) => <TextField {...params} sx={{ width: 200 }} />}
          />
        </LocalizationProvider>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="All">All Statuses</MenuItem>
            {statuses.map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((payment) => {
              const customer = customers.find(c => c.id === payment.customer_id);
              return (
                <TableRow key={payment.id}>
                  <TableCell>
                    {customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown Customer'}
                  </TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.payment_method}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status}
                      color={getStatusColor(payment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(payment)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(payment.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Edit Payment' : 'Add Payment'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Customer</InputLabel>
            <Select
              name="customer_id"
              value={currentPayment.customer_id}
              onChange={handleChange}
              label="Customer"
            >
              {customers.map(customer => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.first_name} {customer.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            value={currentPayment.amount}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Payment Date"
              value={currentPayment.payment_date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
          </LocalizationProvider>
          <FormControl fullWidth margin="dense">
            <InputLabel>Payment Method</InputLabel>
            <Select
              name="payment_method"
              value={currentPayment.payment_method}
              onChange={handleChange}
              label="Payment Method"
            >
              {paymentMethods.map(method => (
                <MenuItem key={method} value={method}>{method}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={currentPayment.status}
              onChange={handleChange}
              label="Status"
            >
              {statuses.map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default Payments;