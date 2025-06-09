
import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { RestaurantMenu, People, EventNote, Star, Payment, LocalShipping } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box sx={{ mr: 2, color }}>{icon}</Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  // Sample data - in a real app, this would come from API calls
  const stats = [
    { title: 'Menu Items', value: '42', icon: <RestaurantMenu />, color: 'primary.main' },
    { title: 'Customers', value: '156', icon: <People />, color: 'secondary.main' },
    { title: 'Reservations', value: '24', icon: <EventNote />, color: 'success.main' },
    { title: 'Reviews', value: '4.8/5', icon: <Star />, color: 'warning.main' },
    { title: 'Revenue', value: '$3,240', icon: <Payment />, color: 'info.main' },
    { title: 'Deliveries', value: '18', icon: <LocalShipping />, color: 'error.main' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        Welcome to your restaurant management dashboard
      </Typography>
      
      <Grid container spacing={3} mt={2}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Activity
        </Typography>
        <Typography variant="body1">
          • New reservation from John Doe for tonight at 7:00 PM
        </Typography>
        <Typography variant="body1">
          • New review: 5 stars from Sarah Johnson
        </Typography>
        <Typography variant="body1">
          • Delivery #1234 completed successfully
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;