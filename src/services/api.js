import axios from 'axios';

const API = axios.create({
  baseURL: 'https://lifeflow-backend-co63.onrender.com/api',
});

// Add token to every request automatically
API.interceptors.request.use(function(config) {
  var userData = localStorage.getItem('lifeflow_user');
  if (userData) {
    var user = JSON.parse(userData);
    if (user.token) {
      config.headers['Authorization'] = 'Token ' + user.token;
    }
  }
  return config;
});

// DONORS
export const getDonors = () => API.get('/donors/');
export const createDonor = (data) => API.post('/donors/', data);
export const updateDonor = (id, data) => API.put('/donors/' + id + '/', data);
export const deleteDonor = (id) => API.delete('/donors/' + id + '/');

// INVENTORY
export const getInventory = () => API.get('/inventory/');
export const updateInventory = (id, data) => API.put('/inventory/' + id + '/', data);

// REQUESTS
export const getRequests = () => API.get('/requests/');
export const createRequest = (data) => API.post('/requests/', data);
export const updateRequest = (id, data) => API.put('/requests/' + id + '/', data);

// DONATIONS
export const getDonations = () => API.get('/donations/');

// DASHBOARD
export const getDashboardStats = () => API.get('/dashboard/');

// AUTH
export const loginUser = (data) => API.post('/login/', data);
export const registerUser = (data) => API.post('/register/', data);
export const logoutUser = () => API.post('/logout/');


export default API;