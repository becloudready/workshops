import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export const getTrainingPlans = () =>
  axios.get(`${API_BASE}/curriculum`);

export const getTrainingPlan = (id) =>
  axios.get(`${API_BASE}/curriculum/${id}`);

export const createTrainingPlan = (plan) =>
  axios.post(`${API_BASE}/curriculum`, plan);

export const updateTrainingPlan = (id, plan) =>
  axios.put(`${API_BASE}/curriculum/${id}`, plan);

export const deleteTrainingPlan = (id) =>
  axios.delete(`${API_BASE}/curriculum/${id}`);
