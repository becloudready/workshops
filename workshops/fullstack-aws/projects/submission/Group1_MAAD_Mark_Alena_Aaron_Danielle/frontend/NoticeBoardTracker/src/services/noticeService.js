import axios from 'axios';

const API_BASE = 'http://localhost:8080/api'; // adjust to your backend's actual port

export const getNotices = () => 
  axios.get(`${API_BASE}/notices`);

export const getNotice = (id) => 
  axios.get(`${API_BASE}/notices/${id}`);

export const createNotice = (notice) => 
  axios.post(`${API_BASE}/notices`, notice);

export const updateNotice = (id, notice) => 
  axios.put(`${API_BASE}/notices/${id}`, notice);

export const deleteNotice = (id) => 
  axios.delete(`${API_BASE}/notices/${id}`);