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
} from '@mui/material';
import { Add, Edit, Delete, Event, AccessTime, Person } from '@mui/icons-material';

const Reservations = () => {
  // Sample reservation data - in a real app, this would come from an API
  const [reservations, setReservations] = useState([
    { id: 1, customerName: 'John Doe', date: '2023-06-25', time: '19:00', guests: 4, tableNumber: 7, status: 'Confirmed', phone: '555-1234', notes: 'Anniversary dinner' },
    { id: 2, customerName: 'Jane Smith', date: '2023-06-25', time: '20:00', guests: 2, tableNumber: 3, status: 'Confirmed', phone: '555-5678', notes: '' },
    { id: 3, customerName: 'Bob Johnson', date: '2023-06-26', time: '18:30', guests: 6, tableNumber: 10, status: 'Pending', phone: '555-9012', notes: 'Outdoor seating preferred' },
    { id: 4, customerName: 'Alice Brown', date: '2023-06-27', time: '19:30', guests: 3, tableNumber: 5, status: 'Confirmed', phone: '555-3456', notes: 'Gluten-free options needed' },
  ]);

  const [open, setOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState({
    customerName: '',
    date: '',
    time: '',
    guests: '',
    tableNumber: '',
    status: 'Pending',
    phone: '',
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [dateFilter, setDateFilter] = useState('');

  const statusOptions = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
  const tableNumbers = Array.from({ length: 15 }, (_, i) => i + 1);

  const handleOpen = (reservation = null) => {
    if (reservation) {
      setCurrentReservation(reservation);
      setIsEditing(true);
    } else {
      setCurrentReservation({
        customerName: '',
        date: new Date().toISOString().split('T')[0], // Today's date
        time: '',
        guests: '',
        tableNumber: '',
        status: 'Pending',
        phone: '',
        notes: ''
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
    setCurrentReservation({ ...currentReservation, [name]: value });
  };

  const handleSave = () => {
    if (isEditing) {
      // Update existing reservation
      setReservations(reservations.map(r => r.id === currentReservation.id ? currentReservation : r));
    } else {
      // Add new reservation
      const newReservation = {
        ...currentReservation,
        id: reservations.length + 1,
        guests: parseInt(currentReservation.guests),
        tableNumber: parseInt(currentReservation.tableNumber)
      };
      setReservations([...reservations, newReservation]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setReservations(reservations.filter(r => r.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'error';
      case 'Completed': return 'info';
      default: return 'default';
    }
  };

  const filteredReservations = dateFilter
    ? reservations.filter(r => r.date === dateFilter)
    : reservations;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Reservations</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Reservation
        </Button>
      </Box>

      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Filter by Date"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item>
            {dateFilter && (
              <Button variant="outlined" onClick={() => setDateFilter('')}>
                Clear Filter
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Table</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>
                  <Typography variant="body1">{reservation.customerName}</Typography>
                  <Typography variant="body2" color="text.secondary">{reservation.phone}</Typography>
                </TableCell>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>{reservation.time}</TableCell>
                <TableCell>{reservation.guests}</TableCell>
                <TableCell>{reservation.tableNumber}</TableCell>
                <TableCell>
                  <Chip
                    label={reservation.status}
                    color={getStatusColor(reservation.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex">
                    <IconButton color="primary" onClick={() => handleOpen(reservation)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(reservation.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Reservation Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Reservation' : 'Add Reservation'}</DialogTitle>
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
                value={currentReservation.customerName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />,
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
                value={currentReservation.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="date"
                label="Date"
                type="date"
                fullWidth
                variant="outlined"
                value={currentReservation.date}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Event sx={{ color: 'action.active', mr: 1 }} />,
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="time"
                label="Time"
                type="time"
                fullWidth
                variant="outlined"
                value={currentReservation.time}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <AccessTime sx={{ color: 'action.active', mr: 1 }} />,
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="dense"
                name="guests"
                label="Number of Guests"
                type="number"
                fullWidth
                variant="outlined"
                value={currentReservation.guests}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Table Number</InputLabel>
                <Select
                  name="tableNumber"
                  value={currentReservation.tableNumber}
                  label="Table Number"
                  onChange={handleChange}
                >
                  {tableNumbers.map((num) => (
                    <MenuItem key={num} value={num}>Table {num}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentReservation.status}
                  label="Status"
                  onChange={handleChange}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="notes"
                label="Notes"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                value={currentReservation.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
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

export default Reservations;