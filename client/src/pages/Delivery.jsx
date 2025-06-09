import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
  Chip,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  LocalShipping,
  Phone,
  LocationOn,
  AccessTime,
  Person,
  Restaurant,
} from '@mui/icons-material';

const Delivery = () => {
  // Sample delivery data - in a real app, this would come from an API
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      customerName: 'John Doe',
      address: '123 Main St, Anytown',
      phone: '555-1234',
      items: 'Margherita Pizza, Caesar Salad',
      total: 32.50,
      status: 'Delivered',
      orderId: 'ORD-001',
      orderTime: '2023-06-20 18:30',
      deliveryTime: '2023-06-20 19:15',
      driverName: 'Mike Wilson',
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      address: '456 Oak Ave, Somewhere',
      phone: '555-5678',
      items: 'Pasta Carbonara, Garlic Bread',
      total: 28.75,
      status: 'In Transit',
      orderId: 'ORD-002',
      orderTime: '2023-06-20 19:00',
      deliveryTime: '',
      driverName: 'Sarah Johnson',
    },
    {
      id: 3,
      customerName: 'Bob Johnson',
      address: '789 Pine Rd, Elsewhere',
      phone: '555-9012',
      items: 'Steak, Fries, Soda',
      total: 42.00,
      status: 'Preparing',
      orderId: 'ORD-003',
      orderTime: '2023-06-20 19:15',
      deliveryTime: '',
      driverName: '',
    },
    {
      id: 4,
      customerName: 'Alice Brown',
      address: '101 Maple Dr, Nowhere',
      phone: '555-3456',
      items: 'Burger, Fries, Milkshake',
      total: 22.50,
      status: 'Pending',
      orderId: 'ORD-004',
      orderTime: '2023-06-20 19:30',
      deliveryTime: '',
      driverName: '',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState({
    customerName: '',
    address: '',
    phone: '',
    items: '',
    total: '',
    status: 'Pending',
    orderId: '',
    orderTime: '',
    deliveryTime: '',
    driverName: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const statusOptions = ['Pending', 'Preparing', 'In Transit', 'Delivered', 'Cancelled'];
  const drivers = ['Mike Wilson', 'Sarah Johnson', 'David Lee', 'Emma Garcia', 'James Taylor'];

  const handleOpen = (delivery = null) => {
    if (delivery) {
      setCurrentDelivery(delivery);
      setIsEditing(true);
    } else {
      const now = new Date();
      const formattedDateTime = `${now.toISOString().split('T')[0]} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setCurrentDelivery({
        customerName: '',
        address: '',
        phone: '',
        items: '',
        total: '',
        status: 'Pending',
        orderId: `ORD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        orderTime: formattedDateTime,
        deliveryTime: '',
        driverName: '',
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
    setCurrentDelivery({ ...currentDelivery, [name]: value });
  };

  const handleSave = () => {
    if (isEditing) {
      // Update existing delivery
      setDeliveries(deliveries.map(d => d.id === currentDelivery.id ? currentDelivery : d));
    } else {
      // Add new delivery
      const newDelivery = {
        ...currentDelivery,
        id: deliveries.length + 1,
        total: parseFloat(currentDelivery.total),
      };
      setDeliveries([...deliveries, newDelivery]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setDeliveries(deliveries.filter(d => d.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setDeliveries(deliveries.map(d => {
      if (d.id === id) {
        // If status is changing to Delivered, set the delivery time
        if (newStatus === 'Delivered' && d.status !== 'Delivered') {
          const now = new Date();
          const formattedDateTime = `${now.toISOString().split('T')[0]} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
          return { ...d, status: newStatus, deliveryTime: formattedDateTime };
        }
        return { ...d, status: newStatus };
      }
      return d;
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'In Transit': return 'info';
      case 'Preparing': return 'warning';
      case 'Pending': return 'default';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Preparing': return 1;
      case 'In Transit': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return -1; // Special case
      default: return 0;
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Count deliveries by status
  const statusCounts = statusOptions.reduce((acc, status) => {
    acc[status] = deliveries.filter(d => d.status === status).length;
    return acc;
  }, {});

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Delivery Management</Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={4}>
        {statusOptions.map((status) => (
          <Grid item xs={6} sm={4} md={2.4} key={status}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Chip
                label={status}
                color={getStatusColor(status)}
                sx={{ mb: 1 }}
              />
              <Typography variant="h4">{statusCounts[status] || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Orders</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Delivery
        </Button>
      </Box>

      {/* Filters */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by customer, address, or order ID"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Deliveries Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDeliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell>{delivery.orderId}</TableCell>
                <TableCell>
                  <Typography variant="body2">{delivery.customerName}</Typography>
                  <Typography variant="caption" color="text.secondary">{delivery.phone}</Typography>
                </TableCell>
                <TableCell>{delivery.address}</TableCell>
                <TableCell>{delivery.items}</TableCell>
                <TableCell>${delivery.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Box>
                    <Chip
                      label={delivery.status}
                      color={getStatusColor(delivery.status)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    {delivery.status !== 'Cancelled' && (
                      <FormControl size="small" fullWidth>
                        <Select
                          value=""
                          displayEmpty
                          onChange={(e) => handleStatusChange(delivery.id, e.target.value)}
                          renderValue={() => "Update Status"}
                          size="small"
                        >
                          {statusOptions.map((status) => (
                            <MenuItem key={status} value={status} disabled={status === delivery.status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                </TableCell>
                <TableCell>{delivery.driverName || 'Not assigned'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(delivery)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(delivery.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Delivery Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Delivery' : 'Add Delivery'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                name="customerName"
                label="Customer Name"
                type="text"
                fullWidth
                variant="outlined"
                value={currentDelivery.customerName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Person /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="phone"
                label="Phone Number"
                type="text"
                fullWidth
                variant="outlined"
                value={currentDelivery.phone}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Phone /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="address"
                label="Delivery Address"
                type="text"
                fullWidth
                variant="outlined"
                value={currentDelivery.address}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LocationOn /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="orderId"
                label="Order ID"
                type="text"
                fullWidth
                variant="outlined"
                value={currentDelivery.orderId}
                onChange={handleChange}
                disabled={isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="total"
                label="Total Amount"
                type="number"
                fullWidth
                variant="outlined"
                value={currentDelivery.total}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="orderTime"
                label="Order Time"
                type="text"
                fullWidth
                variant="outlined"
                value={currentDelivery.orderTime}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><AccessTime /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentDelivery.status}
                  label="Status"
                  onChange={handleChange}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Driver</InputLabel>
                <Select
                  name="driverName"
                  value={currentDelivery.driverName}
                  label="Driver"
                  onChange={handleChange}
                >
                  <MenuItem value="">Not Assigned</MenuItem>
                  {drivers.map((driver) => (
                    <MenuItem key={driver} value={driver}>{driver}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="deliveryTime"
                label="Delivery Time"
                type="text"
                fullWidth
                variant="outlined"
                value={currentDelivery.deliveryTime}
                onChange={handleChange}
                disabled={currentDelivery.status !== 'Delivered'}
                placeholder={currentDelivery.status === 'Delivered' ? 'Required' : 'Automatically set when delivered'}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><AccessTime /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="items"
                label="Order Items"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={2}
                value={currentDelivery.items}
                onChange={handleChange}
                placeholder="Enter items separated by commas"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Restaurant /></InputAdornment>,
                }}
              />
            </Grid>
          </Grid>

          {/* Status Stepper */}
          {currentDelivery.status !== 'Cancelled' && (
            <Box mt={3}>
              <Typography variant="subtitle1" gutterBottom>Delivery Progress</Typography>
              <Stepper activeStep={getStatusStep(currentDelivery.status)}>
                <Step>
                  <StepLabel>Order Received</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Preparing</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Out for Delivery</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Delivered</StepLabel>
                </Step>
              </Stepper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Delivery;