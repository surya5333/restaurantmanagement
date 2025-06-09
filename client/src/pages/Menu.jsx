import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
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
  InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import api from '../services/api';

const Menu = () => {
  const defaultMenuItems = [
    {
      id: 1,
      name: 'Classic Burger',
      category: 'Main Course',
      price: 12.99,
      description: 'Juicy beef patty with lettuce, tomato, and special sauce',
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'
    },
    {
      id: 2,
      name: 'Caesar Salad',
      category: 'Appetizer',
      price: 8.99,
      description: 'Fresh romaine lettuce with parmesan, croutons, and Caesar dressing',
      image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500'
    },
    {
      id: 3,
      name: 'Chocolate Lava Cake',
      category: 'Dessert',
      price: 7.99,
      description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
      image_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500'
    },
    {
      id: 4,
      name: 'Iced Coffee',
      category: 'Beverage',
      price: 4.99,
      description: 'Cold-brewed coffee served over ice with optional cream and sugar',
      image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500'
    }
  ];

  const [menuItems, setMenuItems] = useState(defaultMenuItems);
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image_url: 'https://via.placeholder.com/150'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.getMenuItems();
      // Combine default items with fetched items, avoiding duplicates by id
      const fetchedItems = response.data;
      const combinedItems = [...defaultMenuItems, ...fetchedItems.filter(item => 
        !defaultMenuItems.some(defaultItem => defaultItem.id === item.id)
      )];
      setMenuItems(combinedItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      // Fallback to default items if fetch fails
      setMenuItems(defaultMenuItems);
    }
  };

  const handleOpen = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setIsEditing(true);
    } else {
      setCurrentItem({
        name: '',
        category: '',
        price: '',
        description: '',
        image_url: 'https://via.placeholder.com/150'
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
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const handleSave = async () => {
    try {
      const itemData = {
        ...currentItem,
        price: parseFloat(currentItem.price)
      };

      if (isEditing) {
        await api.updateMenuItem(currentItem.id, itemData);
      } else {
        await api.addMenuItem(itemData);
      }
      fetchMenuItems();
      handleClose();
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteMenuItem(id);
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Menu</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Item
        </Button>
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Category Filter</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Category Filter"
            >
              <MenuItem value="All">All Categories</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={item.image_url}
                alt={item.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>{item.name}</Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  ${item.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Category: {item.category}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpen(item)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(item.id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={currentItem.name}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={currentItem.category}
              onChange={handleChange}
              label="Category"
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={currentItem.price}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            multiline
            rows={3}
            fullWidth
            value={currentItem.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="image_url"
            label="Image URL"
            type="text"
            fullWidth
            value={currentItem.image_url}
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

export default Menu;