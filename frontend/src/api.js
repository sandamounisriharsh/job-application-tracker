import axios from 'axios'

const API_BASE = 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_BASE,
})

export const getApplications = (status) =>
  api.get('/applications', { params: status ? { status } : {} }).then((res) => res.data)

export const getStats = () => api.get('/applications/stats').then((res) => res.data)

export const createApplication = (data) => api.post('/applications', data).then((res) => res.data)

export const updateApplication = (id, data) =>
  api.put(`/applications/${id}`, data).then((res) => res.data)

export const deleteApplication = (id) => api.delete(`/applications/${id}`)
