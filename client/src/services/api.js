import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = {
  // Customers
  getCustomers: async () => {
    try {
      const response = await axios.get(`${API_URL}/customers`);
      console.log('Customers data:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching customers:', error.response?.data || error.message);
      throw error;
    }
  },
  addCustomer: async (customer) => {
    try {
      const response = await axios.post(`${API_URL}/customers`, customer);
      console.log('Added customer:', response.data);
      return response;
    } catch (error) {
      console.error('Error adding customer:', error.response?.data || error.message);
      throw error;
    }
  },
  updateCustomer: async (id, customer) => {
    try {
      const response = await axios.put(`${API_URL}/customers/${id}`, customer);
      console.log('Updated customer:', response.data);
      return response;
    } catch (error) {
      console.error('Error updating customer:', error.response?.data || error.message);
      throw error;
    }
  },
  deleteCustomer: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/customers/${id}`);
      console.log('Deleted customer:', response.data);
      return response;
    } catch (error) {
      console.error('Error deleting customer:', error.response?.data || error.message);
      throw error;
    }
  },

  // Menu
  getMenuItems: () => axios.get(`${API_URL}/menu`),
  addMenuItem: (item) => axios.post(`${API_URL}/menu`, item),
  updateMenuItem: (id, item) => axios.put(`${API_URL}/menu/${id}`, item),
  deleteMenuItem: (id) => axios.delete(`${API_URL}/menu/${id}`),

  // Payments
  getPayments: () => axios.get(`${API_URL}/payments`),
  addPayment: (payment) => axios.post(`${API_URL}/payments`, {
    ...payment,
    order_id: `ORD${Date.now()}`, // Generate unique order ID
    items: JSON.stringify([]) // Add empty items array if not provided
  }),
  updatePayment: (id, payment) => axios.put(`${API_URL}/payments/${id}`, payment),
  deletePayment: (id) => axios.delete(`${API_URL}/payments/${id}`),
  getPaymentStats: () => axios.get(`${API_URL}/payments/stats`)
};

export default api;