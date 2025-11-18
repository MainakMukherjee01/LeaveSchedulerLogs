// filepath: src/services/apiService.js
import axios from 'axios';


// Use proxy in development, direct URL in production
const API_BASE = import.meta.env.DEV 
  ? '/api/app-logs'  // Use proxy in development
  : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/app-logs`;

// Configure axios defaults
axios.defaults.timeout = 10000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (error.response?.status === 404) {
      console.error('API endpoint not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error');
    }
    return Promise.reject(error);
  }
);

const apiService = {
    // Get logs with filtering and pagination
    getLogs: async (params = {}) => {
        const response = await axios.get(API_BASE, { params });
        return response.data;
    },

    // Get dashboard statistics
    getDashboardData: async () => {
        const response = await axios.get(`${API_BASE}/dashboard`);
        return response.data;
    },

    // Get detailed statistics
    getStatistics: async () => {
        const response = await axios.get(`${API_BASE}/statistics`);
        return response.data;
    },

    // Get recent failures
    getRecentFailures: async (page = 0, size = 10) => {
        const response = await axios.get(`${API_BASE}/recent-failures`, {
            params: { page, size }
        });
        return response.data;
    },

    // Get authentication logs
    getAuthenticationLogs: async (page = 0, size = 20) => {
        const response = await axios.get(`${API_BASE}/authentication`, {
            params: { page, size }
        });
        return response.data;
    },

    // Get critical operations
    getCriticalOperations: async (page = 0, size = 20) => {
        const response = await axios.get(`${API_BASE}/critical`, {
            params: { page, size }
        });
        return response.data;
    },

    // Get slow operations
    getSlowOperations: async (thresholdMs = 5000, page = 0, size = 10) => {
        const response = await axios.get(`${API_BASE}/slow-operations`, {
            params: { thresholdMs, page, size }
        });
        return response.data;
    },

    // Get logs by correlation ID
    getLogsByCorrelationId: async (correlationId) => {
        const response = await axios.get(`${API_BASE}/trace/${correlationId}`);
        return response.data;
    },

    // Get specific log by ID
    getLogById: async (id) => {
        const response = await axios.get(`${API_BASE}/${id}`);
        return response.data;
    },

    // Cleanup old logs
    cleanupOldLogs: async (daysToKeep = 90) => {
        const response = await axios.delete(`${API_BASE}/cleanup`, {
            params: { daysToKeep }
        });
        return response.data;
    }
};

export default apiService;