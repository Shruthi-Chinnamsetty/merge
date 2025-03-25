import { Schedule } from './types';
import axios from 'axios';
import { format } from 'date-fns';

const API_URL = "http://localhost:8080/api/schedules";

/**
 * Configures headers with authentication token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.warn("No authentication token found");
    // Instead of throwing, return headers without token
    return {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
  
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
};

/**
 * Fetches all schedules for the current user
 */
export const getSchedules = async (): Promise<Schedule[]> => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    if (error.response && error.response.status === 403) {
      // Don't redirect to login, just report the error
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
    const token = localStorage.getItem('token');
    console.log('Using token:', token ? 'Available' : 'Not available');
    
    const formattedData = {
      ...schedule,
      startDate: schedule.startDate ? format(new Date(schedule.startDate), "yyyy-MM-dd'T'HH:mm:ss") : null,
      endDate: schedule.endDate ? format(new Date(schedule.endDate), "yyyy-MM-dd'T'HH:mm:ss") : null,
    };
    
    console.log('Sending schedule data:', formattedData);
    
    const headers = getAuthHeaders();
    console.log('Request headers:', headers);
    
    const response = await axios.post(API_URL, formattedData, headers);
    return response.data;
  } catch (error) {
    console.error("Error creating schedule:", error);
    
    // More detailed error logging
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
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
    
    const response = await axios.put(`${API_URL}/${id}`, formattedData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating schedule:", error);
    if (error.response && error.response.status === 403) {
      throw new Error("Session expired or invalid. Please login again.");
    }
    throw new Error("Failed to update schedule. Please try again.");
  }
};

/**
 * Deletes a schedule
 */
export const deleteSchedule = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  } catch (error) {
    console.error("Error deleting schedule:", error);
    if (error.response && error.response.status === 403) {
      throw new Error("Session expired or invalid. Please login again.");
    }
    throw new Error("Failed to delete schedule. Please try again.");
  }
};