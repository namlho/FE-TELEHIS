import axios from 'axios';
import { BASE_URL } from '../constants';

const http = axios.create({ baseURL: BASE_URL });

const normalize = (res) => Array.isArray(res.data?.data)
  ? res.data.data
  : (Array.isArray(res.data) ? res.data : []);

export const imagesAPI = {
  list: (params) => http.get('/images', { params }),
  byPatient: (id_patient, params) => http.get(`/images/patient/${id_patient}`, { params }),
  upload: (payload) => http.post('/images', payload),
  deleteById: (id) => http.delete(`/images/${id}`),
  deleteByBody: (payload) => http.delete('/images', { data: payload }),
  deleteByPost: (payload) => http.post('/images/delete', payload),
  normalize,
};

export const patientsAPI = {
  list: (params) => http.get('/patients', { params }),
  get: (id) => http.get(`/patients/${id}`),
  add: (data) => http.post('/patients', data),
  update: (id, data) => http.put(`/patients/${id}`, data),
  remove: (id) => http.delete(`/patients/${id}`),
  normalize,
};

export const diseasesAPI = {
  list: () => http.get('/diseases'),
  normalize,
};
