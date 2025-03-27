import { Schedule } from './types';
import axios from 'axios';
import { format } from 'date-fns';

const API_URL = "http://localhost:8080/api/schedules";

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to attach the token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for better error handling
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('API Error:', error);
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
      
      // Handle specific HTTP status codes
      switch (error.response.status) {
        case 401:
          console.error('Authentication error - check token validity');
          break;
        case 403:
          console.error('Permission denied - check user roles');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Fetches all schedules for the current user
 */
export const getSchedules = async (): Promise<Schedule[]> => {
  try {
    console.log('Fetching schedules...');
    const response = await api.get('');
    console.log('Schedules fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    } else if (error.response && error.response.status === 403) {
      throw new Error("Permission denied. Please verify your access.");
    }
    throw new Error("Failed to fetch schedules. Please try again.");
  }
};

/**
 * Creates a new schedule
 */
export const createSchedule = async (schedule: Partial<Schedule>): Promise<Schedule> => {
  try {
    const formattedData = {
      ...schedule,
      startDate: schedule.startDate ? format(new Date(schedule.startDate), "yyyy-MM-dd'T'HH:mm:ss") : null,
      endDate: schedule.endDate ? format(new Date(schedule.endDate), "yyyy-MM-dd'T'HH:mm:ss") : null,
    };
    
    console.log('Creating schedule with data:', formattedData);
    const response = await api.post('', formattedData);
    console.log('Schedule created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating schedule:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    }
    throw new Error(`Failed to create schedule: ${error.message}`);
  }
};

/**
 * Updates an existing schedule
 */
export const updateSchedule = async (id: number, schedule: Partial<Schedule>): Promise<Schedule> => {
  try {
    const formattedData = {
      ...schedule,
      startDate: schedule.startDate ? format(new Date(schedule.startDate), "yyyy-MM-dd'T'HH:mm:ss") : null,
      endDate: schedule.endDate ? format(new Date(schedule.endDate), "yyyy-MM-dd'T'HH:mm:ss") : null,
    };
    
    console.log(`Updating schedule ${id} with data:`, formattedData);
    const response = await api.put(`/${id}`, formattedData);
    console.log('Schedule updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating schedule:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    }
    throw new Error("Failed to update schedule. Please try again.");
  }
};

/**
 * Deletes a schedule
 */
export const deleteSchedule = async (id: number): Promise<void> => {
  try {
    console.log(`Deleting schedule ${id}`);
    await api.delete(`/${id}`);
    console.log(`Schedule ${id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting schedule:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    }
    throw new Error("Failed to delete schedule. Please try again.");
  }
};