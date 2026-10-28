import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

function unwrap(promise) {
  return promise
    .then((res) => res.data.data)
    .catch((error) => {
      const message =
        error.response?.data?.error?.message ||
        error.message ||
        'Unable to reach the API. Confirm the backend is running on localhost:5000.';
      const code = error.response?.data?.error?.code || 'NETWORK_ERROR';
      const wrapped = new Error(message);
      wrapped.code = code;
      wrapped.status = error.response?.status;
      throw wrapped;
    });
}

export const healthCheck = () => unwrap(api.get('/health'));

export const runAlgorithm = (payload) => unwrap(api.post('/algorithms/run', payload));

export const compareAlgorithms = (payload) => unwrap(api.post('/algorithms/compare', payload));

export const fetchDemo = () => unwrap(api.get('/topologies/demo'));

export const listTopologies = () => unwrap(api.get('/topologies'));

export const getTopology = (id) => unwrap(api.get(`/topologies/${id}`));

export const saveTopology = (payload) => unwrap(api.post('/topologies', payload));

export const updateTopology = (id, payload) => unwrap(api.put(`/topologies/${id}`, payload));

export const deleteTopology = (id) => unwrap(api.delete(`/topologies/${id}`));

export const seedDemo = () => unwrap(api.post('/topologies/demo/seed'));
