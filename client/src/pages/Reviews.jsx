import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Avatar,
  IconButton,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Reply, Delete, Flag, ThumbUp } from '@mui/icons-material';

const Reviews = () => {
  // Sample review data - in a real app, this would come from an API
  const [reviews, setReviews] = useState([
    { id: 1, customerName: 'John Doe', rating: 5, date: '2023-06-15', comment: 'Excellent food and service! The pasta was cooked to perfection and the staff was very attentive.', response: 'Thank you for your kind words! We hope to see you again soon.', status: 'Responded' },
    { id: 2, customerName: 'Jane Smith', rating: 4, date: '2023-06-10', comment: 'Great atmosphere and delicious food. The only issue was that the service was a bit slow.', response: '', status: 'Pending' },
    { id: 3, customerName: 'Bob Johnson', rating: 3, date: '2023-06-05', comment: 'Food was good but portions were small for the price. Ambiance was nice though.', response: '', status: 'Pending' },
    { id: 4, customerName: 'Alice Brown', rating: 5, date: '2023-06-01', comment: 'Best restaurant in town! The chef\'s special was amazing and the dessert was to die for.', response: 'We\'re thrilled you enjoyed your meal! The chef will be happy to hear your feedback.', status: 'Responded' },
  ]);

  const [open, setOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [currentReviewId, setCurrentReviewId] = useState(null);
  const [filterRating, setFilterRating] = useState(0);
  const [filterStatus, setFilterStatus] = useState('All');

  const handleOpenResponse = (review) => {
    setCurrentReviewId(review.id);
    setResponseText(review.response);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveResponse = () => {
    setReviews(reviews.map(review => {
      if (review.id === currentReviewId) {
        return { ...review, response: responseText, status: 'Responded' };
      }
      return review;
    }));
    handleClose();
  };

  const handleDeleteReview = (id) => {
    setReviews(reviews.filter(review => review.id !== id));
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Responded': return 'success';
      case 'Pending': return 'warning';
      case 'Flagged': return 'error';
      default: return 'default';
    }
  };

  const handleFlagReview = (id) => {
    setReviews(reviews.map(review => {
      if (review.id === id) {
        return { ...review, status: 'Flagged' };
      }
      return review;
    }));
  };

  const filteredReviews = reviews.filter(review => {
    const matchesRating = filterRating === 0 || review.rating === filterRating;
    const matchesStatus = filterStatus === 'All' || review.status === filterStatus;
    return matchesRating && matchesStatus;
  });

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Count reviews by rating
  const ratingCounts = {};
  for (let i = 1; i <= 5; i++) {
    ratingCounts[i] = reviews.filter(review => review.rating === i).length;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Customer Reviews</Typography>

      {/* Summary Card */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h3">{averageRating}</Typography>
              <Rating value={parseFloat(averageRating)} precision={0.5} readOnly size="large" />
              <Typography variant="subtitle1">{reviews.length} reviews</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Box key={rating} display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2" sx={{ minWidth: 30 }}>{rating}</Typography>
                  <Rating value={rating} readOnly size="small" sx={{ mx: 1 }} />
                  <Box
                    sx={{
                      flexGrow: 1,
                      bgcolor: 'grey.300',
                      height: 10,
                      borderRadius: 5,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        bgcolor: 'primary.main',
                        width: `${(ratingCounts[rating] / reviews.length) * 100}%`,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ ml: 1, minWidth: 30 }}>
                    {ratingCounts[rating]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Filters */}
      <Box display="flex" mb={3} gap={2}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Rating</InputLabel>
          <Select
            value={filterRating}
            label="Filter by Rating"
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <MenuItem value={0}>All Ratings</MenuItem>
            <MenuItem value={5}>5 Stars</MenuItem>
            <MenuItem value={4}>4 Stars</MenuItem>
            <MenuItem value={3}>3 Stars</MenuItem>
            <MenuItem value={2}>2 Stars</MenuItem>
            <MenuItem value={1}>1 Star</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filterStatus}
            label="Filter by Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Responded">Responded</MenuItem>
            <MenuItem value="Flagged">Flagged</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Reviews List */}
      <Grid container spacing={3}>
        {filteredReviews.map((review) => (
          <Grid item xs={12} key={review.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {getInitials(review.customerName)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{review.customerName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {review.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Rating value={review.rating} readOnly />
                    <Chip
                      label={review.status}
                      color={getStatusColor(review.status)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Box>

                <Typography variant="body1" paragraph>
                  {review.comment}
                </Typography>

                {review.response && (
                  <Box sx={{ pl: 2, borderLeft: 2, borderColor: 'primary.main', mt: 2, py: 1 }}>
                    <Typography variant="subtitle2" color="primary">
                      Response from Restaurant:
                    </Typography>
                    <Typography variant="body2">
                      {review.response}
                    </Typography>
                  </Box>
                )}
              </CardContent>

              <Divider />

              <CardActions>
                <Button
                  startIcon={<Reply />}
                  onClick={() => handleOpenResponse(review)}
                >
                  {review.response ? 'Edit Response' : 'Respond'}
                </Button>
                <IconButton color="primary" title="Mark as helpful">
                  <ThumbUp />
                </IconButton>
                <IconButton color="warning" title="Flag review" onClick={() => handleFlagReview(review.id)}>
                  <Flag />
                </IconButton>
                <IconButton color="error" title="Delete review" onClick={() => handleDeleteReview(review.id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Response Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Respond to Review</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your Response"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveResponse} variant="contained" color="primary">
            Save Response
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reviews;